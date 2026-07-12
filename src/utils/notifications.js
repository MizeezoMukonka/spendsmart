            export const requestNotificationPermission = async () => {
            if (!('Notification' in window)) return false;
            if (Notification.permission === 'granted') return true;
            if (Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            }
            return false;
            };

            export const scheduleReminder = () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            const evening = new Date();
            evening.setHours(20, 0, 0, 0);

            let delay = evening.getTime() - now.getTime();
            if (delay < 0) {
                evening.setDate(evening.getDate() + 1);
                delay = evening.getTime() - now.getTime();
            }

            setTimeout(() => {
                new Notification('SpendSmart - Daily Reminder', {
                body: "Don't forget to log today's expenses and income.",
                icon: '/icon-192.png',
                });
                scheduleReminder();
            }, delay);
            };

            export const sendWelcomeNotification = () => {
            if (Notification.permission !== 'granted') return;
            new Notification('Welcome to SpendSmart', {
                body: 'Start tracking your money today. Tap + to add your first transaction.',
                icon: '/icon-192.png',
            });
            };