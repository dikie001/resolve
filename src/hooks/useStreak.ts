import { useEffect, useState } from "react";

interface StreakData {
    currentStreak: number;
    lastVisit: string;
    allVisits: string[];
}

const STORAGE_KEY = "momentum_streak_data";

export function useStreak() {
    const [streakData, setStreakData] = useState<StreakData>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            currentStreak: 0,
            lastVisit: "",
            allVisits: [],
        };
    });

    useEffect(() => {
        const today = new Date().toDateString();

        // Only update if this is a new day
        if (streakData.lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            let newStreak = 1;

            // Check if last visit was yesterday (continuing streak)
            if (streakData.lastVisit === yesterdayStr) {
                newStreak = streakData.currentStreak + 1;
            }
            // If last visit was before yesterday, reset streak
            else if (streakData.lastVisit && streakData.lastVisit !== today) {
                newStreak = 1;
            }
            // First visit ever
            else if (!streakData.lastVisit) {
                newStreak = 1;
            }

            const newData: StreakData = {
                currentStreak: newStreak,
                lastVisit: today,
                allVisits: [...new Set([...streakData.allVisits, today])],
            };

            setStreakData(newData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        }
    }, []);

    return streakData.currentStreak;
}
