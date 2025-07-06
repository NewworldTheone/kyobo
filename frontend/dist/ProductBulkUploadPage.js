import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from './services/productService';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Upload, FileUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
const ProductBulkUploadPage = () => {
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    // 선택된 파일 감시
    const watchedFile = watch('file');
    const selectedFileName = watchedFile && watchedFile.length > 0 ? watchedFile[0].name : null;
    // 샘플 CSV 다운로드
    const downloadSampleCSV = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/products/sample-csv`);
            if (!response.ok) {
                throw new Error('샘플 파일 다운로드에 실패했습니다.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'sample_products.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast('샘플 CSV 파일이 다운로드되었습니다.', 'success');
        }
        catch (error) {
            console.error('샘플 CSV 다운로드 오류:', error);
            toast('샘플 파일 다운로드에 실패했습니다.', 'error');
        }
    };
    // CSV 파일 내용 검증 및 자동 수정
    const validateAndFixCSV = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                try {
                    let content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    // BOM 제거
                    if (content.charCodeAt(0) === 0xFEFF) {
                        content = content.slice(1);
                    }
                    const lines = content.split('\n').filter(line => line.trim());
                    if (lines.length === 0) {
                        reject(new Error('파일이 비어있습니다.'));
                        return;
                    }
                    // 헤더 검증 및 수정
                    const expectedHeaders = ['name', 'sku', 'category', 'brand', 'location', 'quantity', 'safetyStock', 'price', 'description'];
                    const firstLine = lines[0].toLowerCase().replace(/\s/g, '');
                    let headers;
                    if (!expectedHeaders.every(header => firstLine.includes(header.toLowerCase()))) {
                        // 헤더가 없거나 잘못된 경우 자동으로 추가
                        headers = expectedHeaders;
                        lines.unshift(headers.join(','));
                    }
                    else {
                        headers = lines[0].split(',').map(h => h.trim());
                    }
                    // 데이터 행 검증
                    const dataLines = lines.slice(1);
                    const fixedLines = [headers.join(',')];
                    for (let i = 0; i < dataLines.length; i++) {
                        const line = dataLines[i];
                        const values = line.split(',').map(v => v.trim());
                        // 필수 필드 개수 맞추기
                        while (values.length < expectedHeaders.length) {
                            values.push('');
                        }
                        // 숫자 필드 검증 (quantity, safetyStock, price)
                        const quantityIndex = 5;
                        const safetyStockIndex = 6;
                        const priceIndex = 7;
                        if (values[quantityIndex] && isNaN(Number(values[quantityIndex]))) {
                            values[quantityIndex] = '0';
                        }
                        if (values[safetyStockIndex] && isNaN(Number(values[safetyStockIndex]))) {
                            values[safetyStockIndex] = '0';
                        }
                        if (values[priceIndex] && isNaN(Number(values[priceIndex]))) {
                            values[priceIndex] = '0';
                        }
                        fixedLines.push(values.join(','));
                    }
                    // 수정된 내용으로 새 파일 생성
                    const fixedContent = fixedLines.join('\n');
                    const blob = new Blob([fixedContent], { type: 'text/csv;charset=utf-8;' });
                    const fixedFile = new File([blob], file.name, { type: 'text/csv' });
                    resolve(fixedFile);
                }
                catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
            reader.readAsText(file, 'utf-8');
        });
    };
    const onSubmit = async (data) => {
        var _a, _b, _c, _d, _e;
        if (!data.file || data.file.length === 0) {
            toast('파일을 선택해주세요.', 'error');
            return;
        }
        const file = data.file[0];
        // 파일 타입 검증
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
        const fileExtension = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!validTypes.includes(file.type) && fileExtension !== 'csv') {
            toast('CSV 파일만 업로드 가능합니다.', 'error');
            return;
        }
        // 파일 크기 검증 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast('파일 크기는 10MB를 초과할 수 없습니다.', 'error');
            return;
        }
        setIsUploading(true);
        setUploadResult(null); // 이전 결과 초기화
        try {
            // 파일 자동 검증 및 수정
            let processedFile = file;
            try {
                processedFile = await validateAndFixCSV(file);
                if (processedFile !== file) {
                    toast('파일 형식이 자동으로 수정되었습니다.', 'info');
                }
            }
            catch (validationError) {
                console.warn('파일 자동 수정 실패:', validationError);
                // 자동 수정에 실패해도 원본 파일로 계속 진행
            }
            const result = await productService.bulkUpload(processedFile);
            setUploadResult({
                successCount: result.success || 0,
                errorCount: result.failed || 0,
                errors: result.errors || []
            });
            if (result.success > 0) {
                toast(`${result.success}개의 제품이 성공적으로 업로드되었습니다.`, 'success');
            }
            if (result.failed > 0) {
                toast(`${result.failed}개의 제품 업로드에 실패했습니다.`, 'error');
            }
            // 성공 시 폼 리셋
            if (result.success > 0 && result.failed === 0) {
                reset();
            }
        }
        catch (error) {
            console.error('대량 업로드 오류:', error);
            // 에러 응답 처리
            if ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) {
                toast(error.response.data.error, 'error');
                // 상세 에러 정보가 있는 경우
                if (error.response.data.details) {
                    setUploadResult({
                        successCount: 0,
                        errorCount: 1,
                        errors: Array.isArray(error.response.data.details)
                            ? error.response.data.details
                            : [error.response.data.details]
                    });
                }
            }
            else if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 413) {
                toast('파일 크기가 너무 큽니다.', 'error');
            }
            else if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 415) {
                toast('지원하지 않는 파일 형식입니다.', 'error');
            }
            else {
                toast('파일을 업로드하는 중 오류가 발생했습니다.', 'error');
            }
        }
        finally {
            setIsUploading(false);
        }
    };
    // 드래그 앤 드롭 핸들러
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileExtension = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (fileExtension === 'csv') {
                // react-hook-form의 setValue를 사용하여 파일 설정
                const fileInput = document.getElementById('file-upload');
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                // 폼 이벤트 트리거
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
            else {
                toast('CSV 파일만 업로드 가능합니다.', 'error');
            }
        }
    };
    return (_jsxs("div", { className: "container-main", children: [_jsxs("div", { className: "page-header", children: [_jsx("button", { onClick: () => navigate(-1), className: "btn-back", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsx("h1", { className: "page-title", children: "\uB300\uB7C9 \uC5C5\uB85C\uB4DC" })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "card-header flex items-center", children: [_jsx(FileUp, { className: "text-icon text-kyobo" }), _jsx("h2", { className: "card-title", children: "CSV \uD30C\uC77C \uC5C5\uB85C\uB4DC" })] }), _jsxs("div", { className: "card-body", children: [_jsx("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-blue-900 mb-1", children: "\uC0D8\uD50C CSV \uD30C\uC77C" }), _jsx("p", { className: "text-sm text-blue-700", children: "\uC62C\uBC14\uB978 \uD615\uC2DD\uC758 \uC0D8\uD50C \uD30C\uC77C\uC744 \uB2E4\uC6B4\uB85C\uB4DC\uD558\uC5EC \uCC38\uACE0\uD558\uC138\uC694." })] }), _jsxs("button", { type: "button", onClick: downloadSampleCSV, className: "flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "\uC0D8\uD50C \uB2E4\uC6B4\uB85C\uB4DC"] })] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-form", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "CSV \uD30C\uC77C \uC120\uD0DD" }), _jsx("div", { className: "file-upload-area", onDragOver: handleDragOver, onDrop: handleDrop, children: _jsxs("div", { className: "file-upload-content", children: [_jsx(Upload, { className: "file-upload-icon" }), _jsxs("div", { className: "file-upload-text", children: [_jsxs("label", { htmlFor: "file-upload", className: "file-upload-label", children: [_jsx("span", { children: "\uD30C\uC77C \uC120\uD0DD" }), _jsx("input", { id: "file-upload", type: "file", className: "file-upload-input", accept: ".csv,text/csv,application/csv,application/vnd.ms-excel", ...register('file', {
                                                                                required: '파일을 선택해주세요',
                                                                                validate: {
                                                                                    isCSV: (files) => {
                                                                                        var _a;
                                                                                        if (!files || files.length === 0)
                                                                                            return true;
                                                                                        const file = files[0];
                                                                                        const fileExtension = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                                                                                        return fileExtension === 'csv' || 'CSV 파일만 업로드 가능합니다.';
                                                                                    },
                                                                                    size: (files) => {
                                                                                        if (!files || files.length === 0)
                                                                                            return true;
                                                                                        const file = files[0];
                                                                                        return file.size <= 10 * 1024 * 1024 || '파일 크기는 10MB를 초과할 수 없습니다.';
                                                                                    }
                                                                                }
                                                                            }) })] }), _jsx("p", { className: "pl-1", children: "\uB610\uB294 \uC5EC\uAE30\uC5D0 \uD30C\uC77C\uC744 \uB04C\uC5B4\uB2E4 \uB193\uC73C\uC138\uC694" })] }), selectedFileName && (_jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["\uC120\uD0DD\uB41C \uD30C\uC77C: ", selectedFileName] })), _jsx("p", { className: "file-upload-hint", children: "CSV \uD30C\uC77C\uB9CC \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD569\uB2C8\uB2E4. \uCD5C\uB300 10MB" })] }) }), errors.file && (_jsx("p", { className: "form-error", children: errors.file.message }))] }), _jsxs("div", { className: "info-box", children: [_jsx("h3", { className: "info-box-title", children: "CSV \uD30C\uC77C \uD615\uC2DD" }), _jsxs("div", { className: "info-box-content", children: [_jsx("p", { children: "\uB2E4\uC74C \uC5F4\uC744 \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4:" }), _jsxs("ul", { className: "info-box-list", children: [_jsxs("li", { children: [_jsx("strong", { children: "sku" }), " (\uD544\uC218): \uC81C\uD488 \uACE0\uC720 \uCF54\uB4DC"] }), _jsxs("li", { children: [_jsx("strong", { children: "name" }), " (\uD544\uC218): \uC81C\uD488\uBA85"] }), _jsxs("li", { children: [_jsx("strong", { children: "category" }), " (\uD544\uC218): \uCE74\uD14C\uACE0\uB9AC"] }), _jsxs("li", { children: [_jsx("strong", { children: "brand" }), " (\uD544\uC218): \uBE0C\uB79C\uB4DC"] }), _jsxs("li", { children: [_jsx("strong", { children: "location" }), " (\uD544\uC218): \uC704\uCE58"] }), _jsxs("li", { children: [_jsx("strong", { children: "quantity" }), " (\uD544\uC218): \uC218\uB7C9 (\uC22B\uC790)"] }), _jsxs("li", { children: [_jsx("strong", { children: "safetyStock" }), " (\uD544\uC218): \uC548\uC804 \uC7AC\uACE0 (\uC22B\uC790)"] }), _jsxs("li", { children: [_jsx("strong", { children: "price" }), " (\uD544\uC218): \uB2E8\uAC00 (\uC22B\uC790)"] }), _jsxs("li", { children: [_jsx("strong", { children: "description" }), " (\uC120\uD0DD): \uC81C\uD488 \uC124\uBA85"] })] }), _jsxs("div", { className: "mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded", children: [_jsx("p", { className: "text-sm text-yellow-800 font-medium", children: "\uC8FC\uC758\uC0AC\uD56D:" }), _jsxs("ul", { className: "mt-1 text-sm text-yellow-700 list-disc list-inside", children: [_jsx("li", { children: "\uCCAB \uBC88\uC9F8 \uD589\uC740 \uBC18\uB4DC\uC2DC \uD5E4\uB354(\uCEEC\uB7FC\uBA85)\uC5EC\uC57C \uD569\uB2C8\uB2E4." }), _jsx("li", { children: "SKU\uB294 \uC911\uBCF5\uB420 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx("li", { children: "\uC218\uB7C9, \uC548\uC804\uC7AC\uACE0, \uAC00\uACA9\uC740 \uC22B\uC790 \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4." }), _jsx("li", { children: "UTF-8 \uC778\uCF54\uB529\uC744 \uC0AC\uC6A9\uD574\uC8FC\uC138\uC694." })] })] }), _jsx("p", { className: "mt-3", children: _jsx("a", { href: "/api/products/sample-csv", download: "products_sample.csv", className: "info-box-link", children: "\uC0D8\uD50C CSV \uD30C\uC77C \uB2E4\uC6B4\uB85C\uB4DC" }) })] })] }), _jsxs("div", { className: "flex justify-end space-x-buttons", children: [_jsx("button", { type: "button", onClick: () => navigate(-1), className: "btn-secondary", disabled: isUploading, children: "\uCDE8\uC18C" }), _jsx("button", { type: "submit", disabled: isUploading || !watchedFile || watchedFile.length === 0, className: "btn-primary", children: isUploading ? '업로드 중...' : '업로드' })] })] }), uploadResult && (_jsx("div", { className: `result-display ${uploadResult.errorCount > 0 ? 'result-display-error' : 'result-display-success'}`, children: _jsxs("div", { className: "result-display-content", children: [_jsx("div", { className: "result-display-icon", children: uploadResult.errorCount > 0 ? (_jsx(AlertTriangle, { className: "text-icon text-red-400" })) : (_jsx(CheckCircle, { className: "text-icon text-green-400" })) }), _jsxs("div", { className: "result-display-body", children: [_jsx("h3", { className: `result-display-title ${uploadResult.errorCount > 0 ? 'text-red-800' : 'text-green-800'}`, children: "\uC5C5\uB85C\uB4DC \uACB0\uACFC" }), _jsxs("div", { className: `result-display-details ${uploadResult.errorCount > 0 ? 'text-red-700' : 'text-green-700'}`, children: [_jsxs("p", { children: ["\uC131\uACF5: ", uploadResult.successCount, "\uAC74"] }), uploadResult.errorCount > 0 && (_jsxs("p", { children: ["\uC2E4\uD328: ", uploadResult.errorCount, "\uAC74"] })), uploadResult.errors && uploadResult.errors.length > 0 && (_jsxs("div", { className: "result-display-errors", children: [_jsx("p", { className: "result-display-errors-title", children: "\uC624\uB958 \uB0B4\uC5ED:" }), _jsxs("ul", { className: "result-display-errors-list", children: [uploadResult.errors.slice(0, 10).map((error, index) => (_jsx("li", { children: error }, index))), uploadResult.errors.length > 10 && (_jsxs("li", { className: "text-sm italic", children: ["... \uADF8 \uC678 ", uploadResult.errors.length - 10, "\uAC1C\uC758 \uC624\uB958"] }))] })] }))] }), uploadResult.successCount > 0 && (_jsx("div", { className: "mt-4 pt-4 border-t", children: _jsx("button", { onClick: () => navigate('/products'), className: "text-sm text-blue-600 hover:text-blue-800 font-medium", children: "\uC81C\uD488 \uBAA9\uB85D\uC73C\uB85C \uC774\uB3D9 \u2192" }) }))] })] }) }))] })] })] }));
};
export default ProductBulkUploadPage;
