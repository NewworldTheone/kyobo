import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useToastContext } from './ToastContext';
import { useAuth } from './hooks/useAuth';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
export default function SettingsPage() {
    const { toast } = useToastContext();
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            lowStock: true,
        },
        display: {
            darkMode: false,
            compactView: false,
            showImages: true,
        },
        export: {
            includeImages: true,
            includeHistory: true,
            format: 'xlsx',
        },
    });
    const handleSave = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(settings),
            });
            if (!response.ok) {
                throw new Error('설정 저장에 실패했습니다.');
            }
            toast('설정이 저장되었습니다.', 'success');
        }
        catch (error) {
            toast(error instanceof Error ? error.message : '설정 저장에 실패했습니다.', 'error');
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "\uC124\uC815" }), _jsx(Button, { onClick: handleSave, children: "\uC800\uC7A5" })] }), _jsxs("div", { className: "grid gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC54C\uB9BC \uC124\uC815" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "email-notifications", children: "\uC774\uBA54\uC77C \uC54C\uB9BC" }), _jsx(Switch, { id: "email-notifications", checked: settings.notifications.email, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    notifications: { ...prev.notifications, email: checked },
                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "push-notifications", children: "\uD478\uC2DC \uC54C\uB9BC" }), _jsx(Switch, { id: "push-notifications", checked: settings.notifications.push, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    notifications: { ...prev.notifications, push: checked },
                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "low-stock-notifications", children: "\uC7AC\uACE0 \uBD80\uC871 \uC54C\uB9BC" }), _jsx(Switch, { id: "low-stock-notifications", checked: settings.notifications.lowStock, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    notifications: { ...prev.notifications, lowStock: checked },
                                                })) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uD654\uBA74 \uC124\uC815" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "dark-mode", children: "\uB2E4\uD06C \uBAA8\uB4DC" }), _jsx(Switch, { id: "dark-mode", checked: settings.display.darkMode, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    display: { ...prev.display, darkMode: checked },
                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "compact-view", children: "\uAC04\uB2E8 \uBCF4\uAE30" }), _jsx(Switch, { id: "compact-view", checked: settings.display.compactView, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    display: { ...prev.display, compactView: checked },
                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "show-images", children: "\uC774\uBBF8\uC9C0 \uD45C\uC2DC" }), _jsx(Switch, { id: "show-images", checked: settings.display.showImages, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    display: { ...prev.display, showImages: checked },
                                                })) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uB0B4\uBCF4\uB0B4\uAE30 \uC124\uC815" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "include-images", children: "\uC774\uBBF8\uC9C0 \uD3EC\uD568" }), _jsx(Switch, { id: "include-images", checked: settings.export.includeImages, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    export: { ...prev.export, includeImages: checked },
                                                })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "include-history", children: "\uC774\uB825 \uD3EC\uD568" }), _jsx(Switch, { id: "include-history", checked: settings.export.includeHistory, onCheckedChange: (checked) => setSettings((prev) => ({
                                                    ...prev,
                                                    export: { ...prev.export, includeHistory: checked },
                                                })) })] })] })] })] })] }));
}
