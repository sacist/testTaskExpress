import app from "./app";
import { connectToMongo } from "./mongo/connect";

const PORT=process.env.PORT||3000

const startServer=async()=>{
    try {
        await connectToMongo()
        app.listen(PORT,()=>{
            console.log(`Сервер запущен на порту ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

startServer()