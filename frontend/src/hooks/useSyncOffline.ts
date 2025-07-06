import { useState, useEffect, useCallback } from 'react';
import { useToastContext } from '../ToastContext';
import { offlineService } from '../services/offlineService';

export function useSyncOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToastContext();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast("온라인 상태로 전환되었습니다", "info");
      syncChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast("오프라인 상태로 전환되었습니다. 변경사항이 로컬에 저장됩니다.", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncChanges = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      setIsSyncing(true);
      const changes = await offlineService.getChanges();
      
      if (changes.length === 0) return;

      // 각 변경사항을 서버에 적용
      for (const change of changes) {
        try {
          switch (change.type) {
            case 'CREATE':
              await fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify(change.data),
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            case 'UPDATE':
              await fetch(`/api/products/${change.data.id}`, {
                method: 'PUT',
                body: JSON.stringify(change.data),
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            case 'DELETE':
              await fetch(`/api/products/${change.data.id}`, {
                method: 'DELETE',
              });
              break;
          }
        } catch (error) {
          console.error('Error syncing change:', error);
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
          toast(`변경사항 동기화 중 오류가 발생했습니다: ${errorMessage}`, "error");
        }
      }

      await offlineService.clearChanges();
      toast(`${changes.length}개의 변경사항이 동기화되었습니다.`, "success");
    } catch (error) {
      console.error('Error during sync:', error);
      toast("변경사항 동기화 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveOfflineChange = useCallback(async (type: string, data: any) => {
    try {
      await offlineService.saveChange({ type, data });
      toast("오프라인 변경사항이 저장되었습니다. 온라인 상태가 되면 자동으로 동기화됩니다.", "info");
    } catch (error) {
      console.error('Error saving offline change:', error);
      toast("오프라인 변경사항을 저장하는 중 오류가 발생했습니다.", "error");
    }
  }, []);

  return {
    isOnline,
    isSyncing,
    saveOfflineChange,
    syncChanges,
  };
}
