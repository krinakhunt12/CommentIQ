import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnalysisResult } from '../types';

interface RealTimeMessage {
    type: 'file_update' | 'peer_refactor';
    user?: string;
    file?: string;
    data?: AnalysisResult;
}

export const useRealTime = (onFileUpdate: (data: AnalysisResult) => void) => {
    const [connected, setConnected] = useState(false);
    const [peerUpdates, setPeerUpdates] = useState<{ user: string, file: string }[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws');
        socketRef.current = socket;

        socket.onopen = () => {
            setConnected(true);
            console.log('Real-Time Engine Connected');
        };

        socket.onmessage = (event) => {
            const msg: RealTimeMessage = JSON.parse(event.data);

            if (msg.type === 'file_update' && msg.data) {
                onFileUpdate(msg.data);
            } else if (msg.type === 'peer_refactor') {
                setPeerUpdates(prev => [...prev, { user: msg.user || 'Peer', file: msg.file || 'unknown' }].slice(-5));
            }
        };

        socket.onclose = () => {
            setConnected(false);
            console.log('Real-Time Engine Disconnected');
        };

        return () => {
            socket.close();
        };
    }, [onFileUpdate]);

    const broadcastRefactor = useCallback((fileName: string, userName: string = 'User') => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'refactor',
                user: userName,
                file: fileName
            }));
        }
    }, []);

    return { connected, peerUpdates, broadcastRefactor };
};
