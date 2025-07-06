import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Camera, QrCode, AlertTriangle } from 'lucide-react';
const BarcodeScannerPage = () => {
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [videoDevices, setVideoDevices] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [stream, setStream] = useState(null);
    // 카메라 장치 목록 가져오기
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevs = devices.filter(device => device.kind === 'videoinput');
                setVideoDevices(videoDevs);
                if (videoDevs.length > 0) {
                    setSelectedDeviceId(videoDevs[0].deviceId);
                }
            }
            catch (error) {
                console.error('카메라 장치 목록 가져오기 오류:', error);
                setPermissionDenied(true);
            }
        };
        getDevices();
    }, []);
    // 카메라 스트림 시작
    const startCamera = async () => {
        if (!selectedDeviceId)
            return;
        try {
            const constraints = {
                video: {
                    deviceId: { exact: selectedDeviceId },
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            const videoElement = document.getElementById('scanner-preview');
            if (videoElement) {
                videoElement.srcObject = mediaStream;
                videoElement.play();
            }
            setScanning(true);
            toast('카메라가 시작되었습니다. 바코드를 카메라에 비춰주세요. 자동 인식이 지원되지 않으므로 수동으로 입력해주세요.', 'success');
        }
        catch (error) {
            console.error('카메라 시작 오류:', error);
            setPermissionDenied(true);
            toast('카메라 접근 권한이 없거나 장치를 사용할 수 없습니다.', 'error');
        }
    };
    // 카메라 스트림 중지
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setScanning(false);
    };
    // 바코드 스캔 결과 처리
    const handleScanResult = (result) => {
        if (result) {
            toast(`바코드 스캔 완료: ${result}`, 'success');
            // 제품 검색 페이지로 이동
            navigate(`/products?search=${encodeURIComponent(result)}`);
        }
    };
    // 수동 입력 처리
    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualInput.trim()) {
            handleScanResult(manualInput.trim());
        }
    };
    // 컴포넌트 언마운트 시 카메라 정리
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors", children: _jsx(ArrowLeft, { className: "w-6 h-6" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\uBC14\uCF54\uB4DC \uC2A4\uCE90\uB108" })] }), permissionDenied && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-red-500 mr-2" }), _jsxs("div", { children: [_jsx("h3", { className: "text-red-800 font-medium", children: "\uCE74\uBA54\uB77C \uC811\uADFC \uBD88\uAC00" }), _jsx("p", { className: "text-red-600 text-sm mt-1", children: "\uCE74\uBA54\uB77C \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uAC70\uB098 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC218\uB3D9\uC73C\uB85C \uBC14\uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694." })] })] }) })), videoDevices.length > 0 && !permissionDenied && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\uCE74\uBA54\uB77C \uC120\uD0DD" }), _jsx("select", { value: selectedDeviceId, onChange: (e) => setSelectedDeviceId(e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: videoDevices.map((device) => (_jsx("option", { value: device.deviceId, children: device.label || `카메라 ${device.deviceId.slice(0, 8)}` }, device.deviceId))) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-4 mb-6", children: [_jsx("div", { className: "aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4", children: _jsx("video", { id: "scanner-preview", className: "w-full h-full object-cover", autoPlay: true, playsInline: true, muted: true }) }), _jsx("div", { className: "flex gap-2", children: !scanning ? (_jsxs("button", { onClick: startCamera, disabled: !selectedDeviceId || permissionDenied, className: "flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center", children: [_jsx(Camera, { className: "w-5 h-5 mr-2" }), "\uCE74\uBA54\uB77C \uC2DC\uC791"] })) : (_jsx("button", { onClick: stopCamera, className: "flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center", children: "\uCE74\uBA54\uB77C \uC911\uC9C0" })) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-4", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 mb-4 flex items-center", children: [_jsx(QrCode, { className: "w-5 h-5 mr-2" }), "\uC218\uB3D9 \uBC14\uCF54\uB4DC \uC785\uB825"] }), _jsxs("form", { onSubmit: handleManualSubmit, children: [_jsx("div", { className: "mb-4", children: _jsx("input", { type: "text", value: manualInput, onChange: (e) => setManualInput(e.target.value), placeholder: "\uBC14\uCF54\uB4DC \uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694", className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }) }), _jsx("button", { type: "submit", disabled: !manualInput.trim(), className: "w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: "\uAC80\uC0C9" })] })] }), _jsxs("div", { className: "mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h4", { className: "text-blue-800 font-medium mb-2", children: "\uC0AC\uC6A9 \uBC29\uBC95" }), _jsxs("ul", { className: "text-blue-600 text-sm space-y-1", children: [_jsx("li", { children: "\u2022 \uCE74\uBA54\uB77C\uB97C \uC2DC\uC791\uD558\uACE0 \uBC14\uCF54\uB4DC\uB97C \uD654\uBA74\uC5D0 \uBE44\uCDB0\uC8FC\uC138\uC694" }), _jsx("li", { children: "\u2022 \uC790\uB3D9 \uC778\uC2DD\uC774 \uC9C0\uC6D0\uB418\uC9C0 \uC54A\uC73C\uBBC0\uB85C \uC218\uB3D9\uC73C\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694" }), _jsx("li", { children: "\u2022 \uBC14\uCF54\uB4DC \uBC88\uD638\uB97C \uC9C1\uC811 \uC785\uB825\uD558\uC5EC \uC81C\uD488\uC744 \uAC80\uC0C9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4" })] })] })] }) }));
};
export default BarcodeScannerPage;
