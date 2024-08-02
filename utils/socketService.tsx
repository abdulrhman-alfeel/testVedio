// import { API_URI } from "../api/client"
import io from 'socket.io-client';
import {Api} from '../Src/api/axiosFile';
// groovy

// Verify

// Open In Editor
// Edit
// Copy code
// android {
//     lint {
//         abortOnError false
//     }
// }
// class WSService {
//     initializeSocket = async () => {
//         try {
//             this.socket = io(Api, {
//                 transports: ["websocket"]
//             })
//             //("initializing socket", this.socket)

//             this.socket.on("connect", (data) => {
//                 //("==== socket connected ====")
//                 //(JSON.stringify(data))
//             })
//             this.socket.on("disconnect", (data) => {
//                 //("==== socketdisconnected ====")
//                 //(JSON.stringify(data))
//             })
//             this.socket.on("error", (data) => {
//                 //("socekt error", data)
//             })
//         } catch (error) {
//             //("socket is not inialized", error)
//         }
//     }

//     emit(event, data = {}) {
//         this.socket.emit(event, data)
//     }
//     on(event, cb) {
//         this.socket.on(event, cb)
//     }

//     removeListener(listenerName) {
//         this.socket.removeListener(listenerName)
//     }

// }
// const socket = new WSService()

// const socket = io(Api, {
//     transports: ["websocket"],
//   });
const socket = io(Api);
export default socket;
