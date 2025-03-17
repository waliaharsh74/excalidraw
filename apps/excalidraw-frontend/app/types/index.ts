type Shape =
    | {
        type: "rectangle";
        x: number;
        y: number;
        width: number;
        height: number;
        color?: string; 
    }
    | {
        type: "circle";
        x: number;
        y: number;
        radius: number;
        color?: string; 
    }
    | {
        type: "pencil";
        points: { x: number; y: number }[];
        color?: string; 
    }
    | {
        type: "text";
        x: number;
        y: number;
        text: string;
        color?: string; 
    };

export { type Shape };