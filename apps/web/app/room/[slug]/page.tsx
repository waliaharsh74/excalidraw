import axios from "axios"
import { BACKEND_URL } from "../../config"
import { ChatRoomClient } from "./chatRoomClient"

const ChatRoom = async ({ params }: {
    params: Promise<{
        slug: string
    }>
}) => {
    const slug = (await params).slug
    const roomData = await axios.post(`${BACKEND_URL}/api/v1/get-slug/${slug}`)
    const chatData = await axios.post(`${BACKEND_URL}/api/v1/get-room/${roomData?.data?.roomId}`)


    return (
        <div>
            <ChatRoomClient messages={chatData.data.chat} roomId={roomData?.data.roomId} />
        </div>

    )
}
const getRoom = async () => {
    const response = await axios.get('');

}
export default ChatRoom