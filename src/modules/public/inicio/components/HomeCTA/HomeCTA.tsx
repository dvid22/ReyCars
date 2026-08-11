"use client";

import {
  CalendarDays,
  Clock3,
  Heart,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useEffect,
  useState,
} from "react";

import { useHomeContent } from "@/hooks/useHomeContent";
import { useSiteConfig } from "@/hooks/useSiteConfig";

import styles from "./HomeCTA.module.css";

type ScheduleItem = {
  key: string;
  short: string;
  label: string;
  open: string;
  close: string;
  openMinutes: number;
  closeMinutes: number;
  days: number[];
};

function parseTimeMinutes(
  value: string
) {
  const [
    hour,
    minute,
  ] =
    value
      .split(":")
      .map(Number);

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return 0;
  }

  return (
    hour * 60 +
    minute
  );
}

function formatTime(
  value: string
) {
  const [
    rawHour,
    rawMinute,
  ] =
    value.split(":");

  const hour =
    Number(rawHour);

  const minute =
    Number(rawMinute);

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return value;
  }

  const period =
    hour >= 12
      ? "p. m."
      : "a. m.";

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${String(
    minute
  ).padStart(2, "0")} ${period}`;
}

const TIME_ZONE = "America/Bogota";

function getBogotaParts(date: Date) {
  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: TIME_ZONE,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  ).formatToParts(date);

  const map = Object.fromEntries(
    parts.map((part) => [
      part.type,
      part.value,
    ])
  );

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    day: dayMap[map.weekday] ?? 0,
    hour: Number(map.hour ?? 0),
    minute: Number(map.minute ?? 0),
    second: Number(map.second ?? 0),
  };
}

function getScheduleForDay(
  schedule: ScheduleItem[],
  day: number
) {
  return schedule.find(
    (item) =>
      item.days.includes(day)
  );
}

function formatDuration(
  totalMinutes: number
) {
  const safeMinutes = Math.max(
    0,
    Math.floor(totalMinutes)
  );

  const hours = Math.floor(
    safeMinutes / 60
  );

  const minutes =
    safeMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function getNextOpening(
  schedule: ScheduleItem[],
  day: number,
  minutesNow: number
) {
  const today =
    getScheduleForDay(
      schedule,
      day
    );

  if (
    today &&
    minutesNow <
      today.openMinutes
  ) {
    return {
      label:
        "Abrimos hoy",
      time: today.open,
    };
  }

  for (
    let offset = 1;
    offset <= 7;
    offset += 1
  ) {
    const nextDay =
      (day + offset) % 7;

    const item =
      getScheduleForDay(
        schedule,
        nextDay
      );

    if (!item) {
      continue;
    }

    const dayName =
      nextDay === 6
        ? "sábado"
        : nextDay === 0
          ? "domingo"
          : "mañana";

    return {
      label:
        offset === 1
          ? "Abrimos mañana"
          : `Abrimos el ${dayName}`,
      time: item.open,
    };
  }

  return {
    label:
      "Próxima apertura",
    time: "Consultar",
  };
}

function AnalogClock({
  hour,
  minute,
  second,
}: {
  hour: number;
  minute: number;
  second: number;
}) {
  const hourDeg =
    ((hour % 12) + minute / 60) * 30;

  const minuteDeg =
    (minute + second / 60) * 6;

  const secondDeg = second * 6;

  const ticks = Array.from(
    { length: 12 },
    (_, index) => index
  );

  return (
    <div
      className={styles.clockScene}
      aria-hidden="true"
    >
      <div className={styles.orbit}>
        <span className={styles.orbitDotOne} />
        <span className={styles.orbitDotTwo} />
      </div>

      <div className={styles.clock}>
        {ticks.map((tick) => (
          <span
            key={tick}
            className={styles.tick}
            style={{
              transform: `rotate(${tick * 30}deg)`,
            }}
          />
        ))}

        <span
          className={styles.hourHand}
          style={{
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
          }}
        />

        <span
          className={styles.minuteHand}
          style={{
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
          }}
        />

        <span
          className={styles.secondHand}
          style={{
            transform: `translateX(-50%) rotate(${secondDeg}deg)`,
          }}
        />

        <span className={styles.clockCenter} />
      </div>

      <span className={styles.sunMark}>
        ☼
      </span>

      <span className={styles.moonMark}>
        ☾
      </span>
    </div>
  );
}

export function HomeCTA() {
  const reduceMotion =
    useReducedMotion();

  const {
    content,
    isLoading,
  } = useHomeContent();

  const {
    config,
    isLoading:
      configLoading,
  } = useSiteConfig();

  /*
   * IMPORTANTE:
   * No usamos new Date() durante el primer render.
   *
   * Next.js renderiza este Client Component primero en el servidor
   * y luego React lo hidrata en el navegador. Si la hora se calcula
   * en ambos renders, aunque solo cambie una fracción de segundo,
   * las rotaciones inline de las manecillas pueden ser distintas y
   * React muestra un hydration mismatch.
   *
   * Por eso el SSR y el primer render del cliente usan exactamente
   * el mismo valor estable. Después del montaje actualizamos a la
   * hora real de Colombia.
   */
  const [now, setNow] =
    useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setNow(new Date());
    };

    updateClock();

    const timer = window.setInterval(
      updateClock,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  if (
    isLoading ||
    configLoading ||
    !content ||
    !config
  ) {
    return null;
  }

  const sectionContent =
    content.hoursSection;

  const schedule:
    ScheduleItem[] =
      config.schedule
        .filter(
          (item) =>
            item.active
        )
        .map(
          (item) => ({
            key: item.id,
            short:
              item.short,
            label:
              item.label,
            open:
              formatTime(
                item.open
              ),
            close:
              formatTime(
                item.close
              ),
            openMinutes:
              parseTimeMinutes(
                item.open
              ),
            closeMinutes:
              parseTimeMinutes(
                item.close
              ),
            days:
              item.days,
          })
        );

  if (
    schedule.length === 0
  ) {
    return null;
  }

  const current =
    now
      ? getBogotaParts(now)
      : {
          day: 1,
          hour: 12,
          minute: 0,
          second: 0,
        };

  const minutesNow =
    current.hour * 60 +
    current.minute +
    current.second / 60;

  const todaySchedule =
    getScheduleForDay(
      schedule,
      current.day
    );

  const isOpen =
    Boolean(
      todaySchedule &&
      minutesNow >=
        todaySchedule.openMinutes &&
      minutesNow <
        todaySchedule.closeMinutes
    );

  const statusDetail =
    isOpen &&
    todaySchedule
      ? `Cerramos en ${formatDuration(
          todaySchedule.closeMinutes -
            minutesNow
        )}`
      : (() => {
          const next =
            getNextOpening(
              schedule,
              current.day,
              minutesNow
            );

          return `${next.label} · ${next.time}`;
        })();

  const todayHours =
    todaySchedule
      ? `${todaySchedule.open} – ${todaySchedule.close}`
      : "Sin atención hoy";

  return (
    <section
      className={styles.section}
      aria-labelledby="home-hours-title"
    >
      <div
        className={styles.glowOne}
        aria-hidden="true"
      />

      <div
        className={styles.glowTwo}
        aria-hidden="true"
      />

      <motion.div
        className={styles.panel}
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 26,
                scale: 0.988,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.22,
        }}
        transition={{
          duration: 0.68,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* ======================================
            LEFT
            ====================================== */}
        <motion.div
          className={styles.copy}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -24,
                }
          }
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.62,
            delay: 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.eyebrow}>
            <span>{sectionContent.eyebrow}</span>

            <span className={styles.eyebrowIcon}>
              <Clock3
                size={15}
                strokeWidth={1.7}
              />
            </span>
          </div>

          <h2 id="home-hours-title">
            {sectionContent.title.replace(
              sectionContent.highlightedText,
              ""
            )}
            <strong>
              {sectionContent.highlightedText}
            </strong>
          </h2>

          <p>
            {sectionContent.description}
          </p>

          <AnalogClock
            hour={current.hour}
            minute={current.minute}
            second={current.second}
          />
        </motion.div>

        {/* ======================================
            RIGHT
            ====================================== */}
        <motion.div
          className={styles.scheduleCard}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 24,
                }
          }
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.62,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.statusCard}>
            <span
              className={`${styles.statusClock} ${
                isOpen
                  ? styles.statusClockOpen
                  : styles.statusClockClosed
              }`}
            >
              <span className={styles.statusDot} />

              <Clock3
                size={25}
                strokeWidth={1.6}
              />
            </span>

            <div className={styles.statusCopy}>
              <span
                className={`${styles.statusLabel} ${
                  isOpen
                    ? styles.openLabel
                    : styles.closedLabel
                }`}
              >
                {isOpen
                  ? "Abierto ahora"
                  : "Cerrado ahora"}
              </span>

              <strong>
                {todayHours}
              </strong>

              <p>{statusDetail}</p>
            </div>
          </div>

          <div className={styles.scheduleList}>
            {schedule.map(
              (item, index) => {
                const active =
                  item.days.includes(
                    current.day
                  );

                return (
                  <motion.div
                    key={item.key}
                    className={`${styles.scheduleRow} ${
                      active
                        ? styles.scheduleRowActive
                        : ""
                    }`}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 14,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.24,
                    }}
                    transition={{
                      duration: 0.44,
                      delay:
                        0.12 +
                        index * 0.07,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                  >
                    <div className={styles.timeline}>
                      <span
                        className={`${styles.calendarIcon} ${
                          active
                            ? styles.calendarIconActive
                            : ""
                        }`}
                      >
                        <CalendarDays
                          size={18}
                          strokeWidth={1.65}
                        />
                      </span>

                      {index <
                        schedule.length -
                          1 && (
                        <span
                          className={
                            styles.timelineLine
                          }
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className={styles.dayCopy}>
                      <span>
                        {item.short}
                      </span>

                      <strong>
                        {item.label}
                      </strong>
                    </div>

                    <div className={styles.hours}>
                      {item.open}
                      {" – "}
                      {item.close}
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>

          <div className={styles.reminder}>
            <span className={styles.reminderIcon}>
              <Clock3
                size={18}
                strokeWidth={1.55}
              />
            </span>

            <p>
              Te recomendamos llegar con tiempo
              para brindarte la mejor atención
              personalizada.
            </p>

            <Heart
              size={19}
              strokeWidth={1.45}
              className={styles.reminderHeart}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}