import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/es';

// Configurar Day.js
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);
dayjs.extend(updateLocale);

// Configurar idioma español
dayjs.locale('es');

// Personalizar textos en español
dayjs.updateLocale('es', {
  weekdays: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthsShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años',
  },
});

export const useDateFormatter = () => {
  const formatTaskDate = (date: Date | string | null) => {
    if (!date) return '';

    const taskDate = dayjs(date);
    const now = dayjs();

    // Hoy
    if (taskDate.isToday()) {
      return `Hoy, ${taskDate.format('HH:mm')}`;
    }

    // Mañana
    if (taskDate.isTomorrow()) {
      return `Mañana ${taskDate.format('dddd')}, ${taskDate.format('HH:mm')}`;
    }

    // Ayer
    if (taskDate.isYesterday()) {
      return `Ayer, ${taskDate.format('HH:mm')}`;
    }

    // Esta semana (próximos 7 días)
    const daysFromNow = taskDate.diff(now, 'day');
    if (daysFromNow > 0 && daysFromNow <= 7) {
      return `${taskDate.format('dddd')}, ${taskDate.format('HH:mm')}`;
    }

    // Semana pasada (últimos 7 días)
    if (daysFromNow < 0 && daysFromNow >= -7) {
      return `El ${taskDate.format('dddd')} pasado, ${taskDate.format('HH:mm')}`;
    }

    // Mismo año
    if (taskDate.year() === now.year()) {
      return taskDate.format('D [de] MMMM, HH:mm');
    }

    // Años diferentes
    return taskDate.format('D [de] MMMM [de] YYYY, HH:mm');
  };

  const formatCreatedDate = (date: Date | string | null) => {
    if (!date) return '';

    const createdDate = dayjs(date);
    const now = dayjs();

    // Hoy
    if (createdDate.isToday()) {
      return `Creado hoy a las ${createdDate.format('HH:mm')}`;
    }

    // Ayer
    if (createdDate.isYesterday()) {
      return `Creado ayer a las ${createdDate.format('HH:mm')}`;
    }

    // Esta semana
    const daysFromNow = Math.abs(createdDate.diff(now, 'day'));
    if (daysFromNow <= 7) {
      return `Creado el ${createdDate.format('dddd')} a las ${createdDate.format('HH:mm')}`;
    }

    // Mismo año
    if (createdDate.year() === now.year()) {
      return `Creado el ${createdDate.format('D [de] MMMM')}`;
    }

    // Años diferentes
    return `Creado el ${createdDate.format('D [de] MMMM [de] YYYY')}`;
  };

  const formatRelativeDate = (date: Date | string | null) => {
    if (!date) return '';
    return dayjs(date).fromNow();
  };

  const formatShortDate = (date: Date | string | null) => {
    if (!date) return '';

    const targetDate = dayjs(date);
    const now = dayjs();

    if (targetDate.isToday()) return 'Hoy';
    if (targetDate.isTomorrow()) return 'Mañana';
    if (targetDate.isYesterday()) return 'Ayer';

    // Esta semana
    const daysFromNow = targetDate.diff(now, 'day');
    if (Math.abs(daysFromNow) <= 7) {
      return targetDate.format('dddd');
    }

    // Mismo año
    if (targetDate.year() === now.year()) {
      return targetDate.format('D MMM');
    }

    return targetDate.format('D/M/YY');
  };

  return {
    formatTaskDate,
    formatCreatedDate,
    formatRelativeDate,
    formatShortDate,
    dayjs,
  };
};
