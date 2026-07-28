    export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
    };

    let reminderInterval = null;

    export const scheduleReminder = () => {
    if (Notification.permission !== 'granted') return;
    if (reminderInterval) return;

    reminderInterval = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const lastReminder = localStorage.getItem('ss_last_reminder');
        const today = now.toDateString();

        if (hours === 18 && minutes === 0 && lastReminder !== today) {
        localStorage.setItem('ss_last_reminder', today);
        new Notification('SpendSmart - Daily Reminder', {
            body: "Don't forget to log today's expenses and income.",
            icon: '/icon-192.png',
        });
        }
    }, 60000);
    }; 

    export const stopReminder = () => {
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
    };

    export const sendWelcomeNotification = () => {
    if (Notification.permission !== 'granted') return;
    new Notification('Welcome to SpendSmart', {
        body: 'Start tracking your money today. Tap + to add your first transaction.',
        icon: '/icon-192.png',
    });
    };  