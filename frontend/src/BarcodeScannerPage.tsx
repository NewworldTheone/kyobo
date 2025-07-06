import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Camera, QrCode, AlertTriangle } from 'lucide-react';

const BarcodeScannerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

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
      } catch (error) {
        console.error('카메라 장치 목록 가져오기 오류:', error);
        setPermissionDenied(true);
      }
    };
    
    getDevices();
  }, []);

  // 카메라 스트림 시작
  const startCamera = async () => {
    if (!selectedDeviceId) return;
    
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
      
      const videoElement = document.getElementById('scanner-preview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = mediaStream;
        videoElement.play();
      }
      
      setScanning(true);
      
      toast('카메라가 시작되었습니다. 바코드를 카메라에 비춰주세요. 자동 인식이 지원되지 않으므로 수동으로 입력해주세요.', 'success');
    } catch (error) {
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
  const handleScanResult = (result: string) => {
    if (result) {
      toast(`바코드 스캔 완료: ${result}`, 'success');
      
      // 제품 검색 페이지로 이동
      navigate(`/products?search=${encodeURIComponent(result)}`);
    }
  };

  // 수동 입력 처리
  const handleManualSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">바코드 스캐너</h1>
        </div>

        {/* 권한 거부 메시지 */}
        {permissionDenied && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-red-800 font-medium">카메라 접근 불가</h3>
                <p className="text-red-600 text-sm mt-1">
                  카메라 권한이 거부되었거나 사용할 수 없습니다. 수동으로 바코드를 입력해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 카메라 선택 */}
        {videoDevices.length > 0 && !permissionDenied && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카메라 선택
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `카메라 ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 카메라 미리보기 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
            <video
              id="scanner-preview"
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          </div>
          
          {/* 카메라 제어 버튼 */}
          <div className="flex gap-2">
            {!scanning ? (
              <button
                onClick={startCamera}
                disabled={!selectedDeviceId || permissionDenied}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                카메라 시작
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                카메라 중지
              </button>
            )}
          </div>
        </div>

        {/* 수동 입력 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            수동 바코드 입력
          </h3>
          
          <form onSubmit={handleManualSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="바코드 번호를 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              검색
            </button>
          </form>
        </div>

        {/* 사용 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-medium mb-2">사용 방법</h4>
          <ul className="text-blue-600 text-sm space-y-1">
            <li>• 카메라를 시작하고 바코드를 화면에 비춰주세요</li>
            <li>• 자동 인식이 지원되지 않으므로 수동으로 입력해주세요</li>
            <li>• 바코드 번호를 직접 입력하여 제품을 검색할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerPage;
