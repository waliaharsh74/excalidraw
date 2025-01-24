import axios from "axios"

const ChatRoom = async ({ params }: {
    params: {
        slug: string
    }
}) => {
    const slug = params.slug
    return (
        <div>hi</div>
    )
}
const getRoom = async () => {
    const response = await axios.get('');

}
export default ChatRoom