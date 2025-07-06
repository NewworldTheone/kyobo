import axios from 'axios';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
export const aiService = {
    // 제품 설명 자동 생성
    async generateProductDescription(productName, category, brand) {
        var _a, _b, _c;
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }
        try {
            const prompt = `다음 제품에 대한 상세하고 매력적인 설명을 한국어로 작성해주세요:
제품명: ${productName}
카테고리: ${category}
브랜드: ${brand}

설명은 200자 이내로 작성하고, 제품의 특징과 장점을 포함해주세요.`;
            const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{
                        parts: [{
                                text: prompt
                            }]
                    }]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const geminiResponse = response.data;
            return ((_c = (_b = (_a = geminiResponse.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts[0]) === null || _c === void 0 ? void 0 : _c.text) || '설명을 생성할 수 없습니다.';
        }
        catch (error) {
            console.error('AI 설명 생성 오류:', error);
            throw new Error('AI 설명 생성에 실패했습니다.');
        }
    },
    // 재고 최적화 제안
    async getInventoryOptimization(products) {
        var _a, _b, _c;
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }
        try {
            const lowStockProducts = products.filter(p => p.quantity <= p.safetyStock);
            const overStockProducts = products.filter(p => p.quantity > p.safetyStock * 3);
            const prompt = `다음 재고 데이터를 분석하여 최적화 제안을 해주세요:

부족 재고 제품 수: ${lowStockProducts.length}
과다 재고 제품 수: ${overStockProducts.length}
전체 제품 수: ${products.length}

재고 관리 개선 방안과 구체적인 액션 아이템을 제안해주세요.`;
            const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{
                        parts: [{
                                text: prompt
                            }]
                    }]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const geminiResponse = response.data;
            return ((_c = (_b = (_a = geminiResponse.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts[0]) === null || _c === void 0 ? void 0 : _c.text) || '분석을 생성할 수 없습니다.';
        }
        catch (error) {
            console.error('AI 재고 분석 오류:', error);
            throw new Error('AI 재고 분석에 실패했습니다.');
        }
    },
    // 판매 예측 및 분석
    async getSalesAnalysis(salesData) {
        var _a, _b, _c;
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }
        try {
            const prompt = `다음 판매 데이터를 분석하여 인사이트와 예측을 제공해주세요:

판매 데이터: ${JSON.stringify(salesData, null, 2)}

트렌드 분석, 성장 예측, 개선 방안을 포함하여 분석해주세요.`;
            const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{
                        parts: [{
                                text: prompt
                            }]
                    }]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const geminiResponse = response.data;
            return ((_c = (_b = (_a = geminiResponse.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts[0]) === null || _c === void 0 ? void 0 : _c.text) || '분석을 생성할 수 없습니다.';
        }
        catch (error) {
            console.error('AI 판매 분석 오류:', error);
            throw new Error('AI 판매 분석에 실패했습니다.');
        }
    },
    // 제품 카테고리 자동 분류
    async categorizeProduct(productName, description) {
        var _a, _b, _c, _d;
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }
        try {
            const prompt = `다음 제품을 적절한 카테고리로 분류해주세요:
제품명: ${productName}
${description ? `설명: ${description}` : ''}

가능한 카테고리: 전자제품, 의류, 식품, 생활용품, 스포츠용품, 도서, 화장품, 가구, 기타

가장 적합한 카테고리 하나만 답변해주세요.`;
            const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{
                        parts: [{
                                text: prompt
                            }]
                    }]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const geminiResponse = response.data;
            return ((_d = (_c = (_b = (_a = geminiResponse.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts[0]) === null || _c === void 0 ? void 0 : _c.text) === null || _d === void 0 ? void 0 : _d.trim()) || '기타';
        }
        catch (error) {
            console.error('AI 카테고리 분류 오류:', error);
            return '기타';
        }
    }
};
