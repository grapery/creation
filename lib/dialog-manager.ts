/**
 * 全局弹窗管理器
 * 用于协调各种弹窗的显示，防止重叠
 */

// 弹窗类型定义
export enum DialogType {
    LOGIN_PROMPT = 'login_prompt',
    PAYMENT = 'payment',
    ALERT = 'alert',
    CONFIRM = 'confirm',
    CUSTOM = 'custom',
}

// 弹窗优先级（数字越大优先级越高）
export enum DialogPriority {
    LOW = 0,
    NORMAL = 1,
    HIGH = 2,
    CRITICAL = 3, // 如登录提示、支付弹窗
}

// 弹窗信息
interface DialogInfo {
    id: string;
    type: DialogType;
    priority: DialogPriority;
    onShow?: () => void;
    onHide?: () => void;
}

// 弹窗状态监听器
type DialogChangeListener = (currentDialog: DialogInfo | null, previousDialog: DialogInfo | null) => void;

class DialogManagerClass {
    private currentDialog: DialogInfo | null = null;
    private dialogQueue: DialogInfo[] = [];
    private listeners: DialogChangeListener[] = [];
    private toastVisible = false;

    /**
     * 显示弹窗
     * @param id 弹窗唯一标识
     * @param type 弹窗类型
     * @param priority 优先级
     * @param callbacks 回调函数
     * @returns 是否成功显示
     */
    show(
        id: string,
        type: DialogType = DialogType.CUSTOM,
        priority: DialogPriority = DialogPriority.NORMAL,
        callbacks?: { onShow?: () => void; onHide?: () => void }
    ): boolean {
        const newDialog: DialogInfo = {
            id,
            type,
            priority,
            ...callbacks,
        };

        // 如果当前没有弹窗，直接显示
        if (!this.currentDialog) {
            this.setCurrentDialog(newDialog);
            return true;
        }

        // 如果新弹窗优先级更高，替换当前弹窗
        if (newDialog.priority > this.currentDialog.priority) {
            const previousDialog = this.currentDialog;
            previousDialog.onHide?.();
            this.setCurrentDialog(newDialog);
            // 将被替换的弹窗加入队列
            this.dialogQueue.push(previousDialog);
            return true;
        }

        // 如果优先级相同或更低，加入队列
        this.dialogQueue.push(newDialog);
        return false;
    }

    /**
     * 隐藏弹窗
     * @param id 弹窗ID
     */
    hide(id: string): void {
        if (this.currentDialog?.id === id) {
void this.currentDialog;
            this.currentDialog.onHide?.();

            // 显示队列中的下一个弹窗
            if (this.dialogQueue.length > 0) {
                const nextDialog = this.dialogQueue.shift()!;
                this.setCurrentDialog(nextDialog);
            } else {
                this.setCurrentDialog(null);
            }
        } else {
            // 从队列中移除
            this.dialogQueue = this.dialogQueue.filter(d => d.id !== id);
        }
    }

    /**
     * 隐藏当前所有弹窗
     */
    hideAll(): void {
        if (this.currentDialog) {
            this.currentDialog.onHide?.();
        }
        this.currentDialog = null;
        this.dialogQueue = [];
        this.notifyListeners(null, this.currentDialog);
    }

    /**
     * 检查指定弹窗是否正在显示
     */
    isShowing(id: string): boolean {
        return this.currentDialog?.id === id;
    }

    /**
     * 检查是否有任何弹窗正在显示
     */
    hasAnyDialogShowing(): boolean {
        return this.currentDialog !== null;
    }

    /**
     * 获取当前弹窗
     */
    getCurrentDialog(): DialogInfo | null {
        return this.currentDialog;
    }

    /**
     * 设置Toast可见状态
     */
    setToastVisible(visible: boolean): void {
        this.toastVisible = visible;
    }

    /**
     * 检查Toast是否可见
     */
    isToastVisible(): boolean {
        return this.toastVisible;
    }

    /**
     * 添加监听器
     */
    addListener(listener: DialogChangeListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * 设置当前弹窗并通知监听器
     */
    private setCurrentDialog(dialog: DialogInfo | null): void {
        const previousDialog = this.currentDialog;
        this.currentDialog = dialog;
        dialog?.onShow?.();
        this.notifyListeners(dialog, previousDialog);
    }

    /**
     * 通知所有监听器
     */
    private notifyListeners(current: DialogInfo | null, previous: DialogInfo | null): void {
        this.listeners.forEach(listener => listener(current, previous));
    }
}

// 导出单例
export const DialogManager = new DialogManagerClass();

// 便捷方法
export const showDialog = (
    id: string,
    type?: DialogType,
    priority?: DialogPriority,
    callbacks?: { onShow?: () => void; onHide?: () => void }
) => DialogManager.show(id, type, priority, callbacks);

export const hideDialog = (id: string) => DialogManager.hide(id);

export const hideAllDialogs = () => DialogManager.hideAll();

export const isDialogShowing = (id: string) => DialogManager.isShowing(id);

export const hasAnyDialogShowing = () => DialogManager.hasAnyDialogShowing();
