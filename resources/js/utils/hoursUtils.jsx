import { DAYS_OF_WEEK, DAY_LABELS_FULL, DAY_LABELS_SHORT } from './EditPlaceUtils.js';

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function parseSchedule(hoursData) {
    if (!hoursData || (typeof hoursData === 'object' && Object.keys(hoursData).length === 0)) {
        return null;
    }

    if (typeof hoursData === 'string') {
        return null;
    }

    if (Array.isArray(hoursData)) {
        return hoursData;
    }

    if (typeof hoursData === 'object') {
        return DAY_KEYS.map(dayKey => {
            if (hoursData[dayKey]) {
                return { day: dayKey, closed: false, ranges: hoursData[dayKey] };
            }
            return { day: dayKey, closed: true, ranges: [] };
        });
    }

    return null;
}

function isOpenToday(schedule) {
    if (!schedule) return false;
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    const todayKey = DAY_KEYS[dayIndex];
    const todaySchedule = schedule.find(s => s.day === todayKey);
    return todaySchedule && !todaySchedule.closed && todaySchedule.ranges.length > 0;
}

function getCurrentDayKey() {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
}

export function getHoursShortSummary(hoursData) {
    const schedule = parseSchedule(hoursData);
    if (!schedule) return null;

    const openDays = schedule.filter(d => !d.closed && d.ranges.length > 0);
    if (openDays.length === 0) return 'Cerrado';

    const firstRange = openDays[0].ranges[0];
    if (!firstRange) return '';

    if (openDays.length === 7) {
        return `Lun–Dom ${firstRange.open}–${firstRange.close}`;
    }

    const weekdays = openDays.filter(d => !['saturday', 'sunday'].includes(d.day));
    if (weekdays.length === 5 && openDays.length === 5) {
        return `Lun–Vie ${firstRange.open}–${firstRange.close}`;
    }

    return `${DAY_LABELS_SHORT[openDays[0].day]}–${DAY_LABELS_SHORT[openDays[openDays.length - 1].day]} ${firstRange.open}–${firstRange.close}`;
}

export function HoursDisplayFull({ hours }) {
    const schedule = parseSchedule(hours);
    const currentDayIndex = getCurrentDayKey();
    const openToday = isOpenToday(schedule);

    if (!schedule || schedule.every(d => d.closed)) {
        return (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                <span className="text-lg">🔒</span>
                <div>
                    <p className="text-sm font-medium text-red-700">Cerrado</p>
                    <p className="text-xs text-red-500">No hay horarios disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🕐</span>
                    <span className="text-sm font-medium text-gray-700">Horario</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${openToday ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {openToday ? 'Abierto ahora' : 'Cerrado'}
                </span>
            </div>

            <div className="divide-y divide-gray-50">
                {schedule.map((daySchedule, index) => {
                    const isToday = index === currentDayIndex;
                    const isClosed = daySchedule.closed;
                    const hasRanges = daySchedule.ranges.length > 0;

                    return (
                        <div
                            key={daySchedule.day}
                            className={`px-3 py-2 flex items-center justify-between ${isToday ? 'bg-amber-50' : ''} ${isToday && !isClosed ? 'font-medium' : ''}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium w-16 ${isToday ? 'text-amber-700' : 'text-gray-600'}`}>
                                    {DAYS_OF_WEEK[index].labelFull}
                                </span>
                                {isToday && (
                                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium">
                                        Hoy
                                    </span>
                                )}
                            </div>

                            <div className="text-right">
                                {isClosed ? (
                                    <span className="text-xs text-gray-400 italic">Cerrado</span>
                                ) : hasRanges ? (
                                    <div className="flex flex-col items-end">
                                        {daySchedule.ranges.map((range, idx) => (
                                            <span key={idx} className={`text-xs ${isToday ? 'text-amber-700' : 'text-gray-600'}`}>
                                                {range.open} – {range.close}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">Cerrado</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function HoursDisplay({ hours, showFull = false }) {
    if (!hours) {
        return showFull ? (
            <div className="text-xs text-gray-500">Horario no disponible</div>
        ) : null;
    }

    if (showFull) {
        return <HoursDisplayFull hours={hours} />;
    }

    const summary = getHoursShortSummary(hours);
    if (!summary) return null;

    return (
        <span className="text-xs text-gray-600">
            🕐 {summary}
        </span>
    );
}