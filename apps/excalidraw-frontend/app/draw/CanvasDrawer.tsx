import axios from 'axios';
import { HTTP_BACKEND_URL } from '../config';
import { Shape } from '../types';

export interface Transform {
    scale: number;
    offsetX: number;
    offsetY: number;
}

type ZoomUpdater = (zoom: number) => void;

class CanvasDrawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private shape: string;
    private roomId: number;
    private socket: WebSocket;
    private color: string;
    private transform: Transform;
    private existingShapes: Shape[] = [];
    private updateZoom?: ZoomUpdater;

    // Variables for panning/drawing state
    private clicked: boolean = false;
    private isPanning: boolean = false;
    private panStartX: number = 0;
    private panStartY: number = 0;
    private startOffsetX: number = 0;
    private startOffsetY: number = 0;
    private startX: number = 0;
    private startY: number = 0;
    private currentPencilPoints: { x: number; y: number }[] = [];
    private zoomIntensity: number = 0.1;

    // Setter to update shape and immediately redraw the canvas.
    public setShape(newShape: string) {
        this.shape = newShape;
        this.clearCanvas();
    }

    // Setter to update color and immediately redraw.
    public setColor(newColor: string) {
        this.color = newColor;
        this.clearCanvas();
    }

    private handleSocketMessage = (event: MessageEvent) => {
        const { type, shapeType, color: shapeColor, ...shapeData } = JSON.parse(event.data);
        if (type === 'shape') {
            this.existingShapes.push({ type: shapeType, color: shapeColor, ...shapeData });
            this.clearCanvas();
        }
    };

    private handleMouseDown = (e: MouseEvent) => {
        if (this.shape === 'pan') {
            this.isPanning = true;
            this.panStartX = e.offsetX;
            this.panStartY = e.offsetY;
            this.startOffsetX = this.transform.offsetX;
            this.startOffsetY = this.transform.offsetY;
            this.clearCanvas();
            return;
        }
        this.clicked = true;
        const pos = this.getWorldCoordinates(e);
        this.startX = pos.x;
        this.startY = pos.y;
        if (this.shape === 'pencil') {
            this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
        } else if (this.shape === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                this.existingShapes.push({ type: 'text', x: this.startX, y: this.startY, text, color: this.color });
                this.socket.send(
                    JSON.stringify({
                        type: 'shape',
                        shapeType: 'text',
                        x: this.startX,
                        y: this.startY,
                        text,
                        roomId: this.roomId,
                        color: this.color,
                    })
                );
                this.clearCanvas();
            }
        }
    };

    private handleMouseMove = (e: MouseEvent) => {
        if (this.shape === 'pan') {
            if (!this.isPanning) return;
            const dx = e.offsetX - this.panStartX;
            const dy = e.offsetY - this.panStartY;
            this.transform.offsetX = this.startOffsetX + dx;
            this.transform.offsetY = this.startOffsetY + dy;
            this.ctx.setTransform(
                this.transform.scale,
                0,
                0,
                this.transform.scale,
                this.transform.offsetX,
                this.transform.offsetY
            );
            this.clearCanvas();
            return;
        }
        if (!this.clicked) return;
        this.clearCanvas();
        this.ctx.strokeStyle = this.color;
        const pos = this.getWorldCoordinates(e);
        if (this.shape === 'rectangle') {
            const width = pos.x - this.startX;
            const height = pos.y - this.startY;
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (this.shape === 'pencil') {
            this.currentPencilPoints.push({ x: pos.x, y: pos.y });
            this.ctx.beginPath();
            this.currentPencilPoints.forEach((point, index) => {
                index === 0 ? this.ctx.moveTo(point.x, point.y) : this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.stroke();
        } else if (this.shape === 'circle') {
            const radius = Math.hypot(pos.x - this.startX, pos.y - this.startY);
            this.ctx.beginPath();
            this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    };

    private handleMouseUp = (e: MouseEvent) => {
        if (this.shape === 'pan') {
            this.isPanning = false;
            this.clearCanvas();
            return;
        }
        if (!this.clicked) return;
        this.clicked = false;
        const pos = this.getWorldCoordinates(e);
        if (this.shape === 'rectangle') {
            const width = pos.x - this.startX;
            const height = pos.y - this.startY;
            this.existingShapes.push({ type: 'rectangle', x: this.startX, y: this.startY, width, height, color: this.color });
            this.socket.send(
                JSON.stringify({
                    type: 'shape',
                    shapeType: 'rectangle',
                    x: this.startX,
                    y: this.startY,
                    width,
                    height,
                    roomId: this.roomId,
                    color: this.color,
                })
            );
        } else if (this.shape === 'pencil') {
            this.existingShapes.push({ type: 'pencil', points: [...this.currentPencilPoints], color: this.color });
            this.socket.send(
                JSON.stringify({
                    type: 'shape',
                    shapeType: 'pencil',
                    points: this.currentPencilPoints,
                    color: this.color,
                    roomId: this.roomId,
                })
            );
            this.currentPencilPoints = [];
        } else if (this.shape === 'circle') {
            const radius = Math.hypot(pos.x - this.startX, pos.y - this.startY);
            this.existingShapes.push({ type: 'circle', x: this.startX, y: this.startY, radius, color: this.color });
            this.socket.send(
                JSON.stringify({
                    type: 'shape',
                    shapeType: 'circle',
                    x: this.startX,
                    y: this.startY,
                    radius,
                    roomId: this.roomId,
                    color: this.color,
                })
            );
        }
        this.clearCanvas();
    };

    private handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const oldScale = this.transform.scale;
        let newScale = oldScale;

        if (e.deltaY < 0) {
            newScale = oldScale + this.zoomIntensity;
        } else {
            newScale = Math.max(0.1, oldScale - this.zoomIntensity);
        }

        const worldX = (mouseX - this.transform.offsetX) / oldScale;
        const worldY = (mouseY - this.transform.offsetY) / oldScale;

        this.transform.offsetX = mouseX - newScale * worldX;
        this.transform.offsetY = mouseY - newScale * worldY;
        this.transform.scale = newScale;

        this.ctx.setTransform(
            this.transform.scale,
            0,
            0,
            this.transform.scale,
            this.transform.offsetX,
            this.transform.offsetY
        );
        this.clearCanvas();

        if (this.updateZoom) {
            this.updateZoom(Math.round(newScale * 100));
        }
    };

    private getWorldCoordinates(e: MouseEvent): { x: number; y: number } {
        return {
            x: (e.offsetX - this.transform.offsetX) / this.transform.scale,
            y: (e.offsetY - this.transform.offsetY) / this.transform.scale,
        };
    }

    private clearCanvas(): void {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(
            this.transform.scale,
            0,
            0,
            this.transform.scale,
            this.transform.offsetX,
            this.transform.offsetY
        );

        this.existingShapes.forEach((shape) => {
            this.ctx.strokeStyle = shape.color || '#FFFFFF';
            this.ctx.fillStyle = shape.color || '#FFFFFF';
            if (shape.type === 'rectangle') {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === 'pencil') {
                this.ctx.beginPath();
                shape.points.forEach((point, index) => {
                    index === 0 ? this.ctx.moveTo(point.x, point.y) : this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
            } else if (shape.type === 'text') {
                this.ctx.font = '16px Arial';
                this.ctx.fillText(shape.text, shape.x, shape.y);
            } else if (shape.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        });
    }

    private async getExistingShapes(): Promise<void> {
        try {
            const response = await axios.get(`${HTTP_BACKEND_URL}/api/v1/get-shapes/${this.roomId}`);
            this.existingShapes = response.data.shapes;
        } catch (error) {
            console.error('Error fetching existing shapes:', error);
        }
    }

    private addEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('wheel', this.handleWheel);
        this.socket.addEventListener('message', this.handleSocketMessage);
    }

    private removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('wheel', this.handleWheel);
        this.socket.removeEventListener('message', this.handleSocketMessage);
    }

    public static async create(
        canvas: HTMLCanvasElement,
        shape: string,
        roomId: number,
        socket: WebSocket,
        color: string,
        transform: Transform,
        updateZoom?: ZoomUpdater
    ): Promise<CanvasDrawer> {
        const drawer = new CanvasDrawer(canvas, shape, roomId, socket, color, transform, updateZoom);
        await drawer.getExistingShapes();
        drawer.addEventListeners();
        drawer.clearCanvas();
        return drawer;
    }

    private constructor(
        canvas: HTMLCanvasElement,
        shape: string,
        roomId: number,
        socket: WebSocket,
        color: string,
        transform: Transform,
        updateZoom?: ZoomUpdater
    ) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('CanvasRenderingContext2D is not supported on this canvas.');
        }
        this.ctx = context;
        this.shape = shape;
        this.roomId = roomId;
        this.socket = socket;
        this.color = color;
        this.transform = transform;
        this.updateZoom = updateZoom;
    }

    public cleanup(): void {
        this.removeEventListeners();
        this.socket.onmessage = null;
    }
}

export default CanvasDrawer;
