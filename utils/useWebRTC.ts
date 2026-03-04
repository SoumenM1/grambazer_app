// import { useEffect, useRef, useState } from "react";
// import {
//   RTCPeerConnection,
//   RTCSessionDescription,
//   RTCIceCandidate,
//   mediaDevices,
// } from "react-native-webrtc";
// import { getSocket } from "../../../lib/socket";

// interface UseWebRTCProps {
//   roomId: string;
//   isCaller: boolean;
//   callType: "voice" | "video";
// }

// export const useWebRTC = ({
//   roomId,
//   isCaller,
//   callType,
// }: UseWebRTCProps) => {
//   const socket = getSocket();

//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const localStreamRef = useRef<any>(null);
//   const remoteStreamRef = useRef<any>(null);
//   const [localStream, setLocalStream] = useState<any>(null);
//   const [remoteStream, setRemoteStream] = useState<any>(null);
//   const [callConnected, setCallConnected] = useState(false);

//   const configuration = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   /* ---------------- CREATE PEER ---------------- */

//   const createPeerConnection = async () => {
//     const peer = new RTCPeerConnection(configuration) as any;

//     // Get Media
//     const stream = await mediaDevices.getUserMedia({
//       audio: true,
//       video: callType === "video",
//     });

//     localStreamRef.current = stream;
//     setLocalStream(stream);

//     stream.getTracks().forEach((track) => {
//       peer.addTrack(track, stream);
//     });

//     // Remote stream
//     peer.ontrack = (event:any) => {
//       remoteStreamRef.current = event.streams[0];
//       setRemoteStream(event.streams[0]);
//       setCallConnected(true);
//     };

//     // ICE candidate
//     peer.onicecandidate = (event:any) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           roomId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     peerRef.current = peer;
//   };

//   /* ---------------- CREATE OFFER ---------------- */

//   const createOffer = async () => {
//     if (!peerRef.current) return;

//     const offer = await peerRef.current.createOffer();
//     await peerRef.current.setLocalDescription(offer);

//     socket.emit("offer", { roomId, offer });
//   };

//   /* ---------------- CREATE ANSWER ---------------- */

//   const createAnswer = async (offer: any) => {
//     if (!peerRef.current) return;

//     await peerRef.current.setRemoteDescription(
//       new RTCSessionDescription(offer)
//     );

//     const answer = await peerRef.current.createAnswer();
//     await peerRef.current.setLocalDescription(answer);

//     socket.emit("answer", { roomId, answer });
//   };

//   /* ---------------- HANDLE ANSWER ---------------- */

//   const handleAnswer = async (answer: any) => {
//     if (!peerRef.current) return;

//     await peerRef.current.setRemoteDescription(
//       new RTCSessionDescription(answer)
//     );
//   };

//   /* ---------------- HANDLE ICE ---------------- */

//   const handleIceCandidate = async (candidate: any) => {
//     if (!peerRef.current) return;

//     await peerRef.current.addIceCandidate(
//       new RTCIceCandidate(candidate)
//     );
//   };

//   /* ---------------- END CALL ---------------- */

//   const endCall = () => {
//     socket.emit("end-call", { roomId });

//     peerRef.current?.close();
//     peerRef.current = null;

//     localStreamRef.current?.getTracks().forEach((track: any) =>
//       track.stop()
//     );

//     setLocalStream(null);
//     setRemoteStream(null);
//     setCallConnected(false);
//   };

//   /* ---------------- SOCKET LISTENERS ---------------- */

//   useEffect(() => {
//     socket.emit("join-room", roomId);

//     const start = async () => {
//       await createPeerConnection();

//       if (isCaller) {
//         await createOffer();
//       }
//     };

//     start();

//     socket.on("offer", async (offer) => {
//       await createAnswer(offer);
//     });

//     socket.on("answer", async (answer) => {
//       await handleAnswer(answer);
//     });

//     socket.on("ice-candidate", async (candidate) => {
//       await handleIceCandidate(candidate);
//     });

//     socket.on("call-ended", () => {
//       endCall();
//     });

//     return () => {
//       socket.emit("leave-room", roomId);
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");
//       socket.off("call-ended");

//       endCall();
//     };
//   }, []);

//   return {
//     localStream,
//     remoteStream,
//     callConnected,
//     endCall,
//   };
// };