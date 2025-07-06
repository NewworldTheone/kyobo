import { useState } from 'react';
import { useToastContext } from './ToastContext';
import { useAuth } from './hooks/useAuth';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    lowStock: boolean;
  };
  display: {
    darkMode: boolean;
    compactView: boolean;
    showImages: boolean;
  };
  export: {
    includeImages: boolean;
    includeHistory: boolean;
    format: 'xlsx' | 'csv';
  };
}

export default function SettingsPage() {
  const { toast } = useToastContext();
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({
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
    } catch (error) {
      toast(error instanceof Error ? error.message : '설정 저장에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">설정</h1>
        <Button onClick={handleSave}>저장</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">이메일 알림</Label>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">푸시 알림</Label>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="low-stock-notifications">재고 부족 알림</Label>
              <Switch
                id="low-stock-notifications"
                checked={settings.notifications.lowStock}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, lowStock: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>화면 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">다크 모드</Label>
              <Switch
                id="dark-mode"
                checked={settings.display.darkMode}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    display: { ...prev.display, darkMode: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view">간단 보기</Label>
              <Switch
                id="compact-view"
                checked={settings.display.compactView}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    display: { ...prev.display, compactView: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-images">이미지 표시</Label>
              <Switch
                id="show-images"
                checked={settings.display.showImages}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    display: { ...prev.display, showImages: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>내보내기 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-images">이미지 포함</Label>
              <Switch
                id="include-images"
                checked={settings.export.includeImages}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    export: { ...prev.export, includeImages: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-history">이력 포함</Label>
              <Switch
                id="include-history"
                checked={settings.export.includeHistory}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    export: { ...prev.export, includeHistory: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
