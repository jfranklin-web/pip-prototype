import styles from './MarginMeter.module.css';

interface Props {
  stripeCost: number;   // Stripe infra cost per $100
  customPrice: number;  // AE custom price per $100
  stickerPrice: number; // Sticker / list price per $100
  floor: number;        // Hard floor per $100
}

export function MarginMeter({ stripeCost, customPrice, stickerPrice, floor }: Props) {
  const margin = customPrice - stripeCost;
  const marginPct = customPrice > 0 ? (margin / customPrice) * 100 : 0;

  // Determine zone: green = at/above sticker, amber = between floor and sticker, red = below floor
  const zone =
    customPrice <= 0
      ? 'neutral'
      : customPrice < floor
      ? 'red'
      : customPrice < stickerPrice
      ? 'amber'
      : 'green';

  // Bar fill: 0 = floor, 100% = sticker + 20% headroom
  const maxBar = stickerPrice * 1.2;
  const minBar = Math.max(0, floor * 0.5);
  const fillPct = Math.min(100, Math.max(0, ((customPrice - minBar) / (maxBar - minBar)) * 100));

  const floorPct = Math.min(100, Math.max(0, ((floor - minBar) / (maxBar - minBar)) * 100));
  const stickerPct = Math.min(100, Math.max(0, ((stickerPrice - minBar) / (maxBar - minBar)) * 100));

  return (
    <div className={styles.meter}>
      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${styles[zone]}`}
          style={{ width: `${fillPct}%` }}
        />
        {/* Floor marker */}
        <div className={styles.marker} style={{ left: `${floorPct}%` }}>
          <div className={styles.markerLine} />
          <span className={styles.markerLabel}>Floor</span>
        </div>
        {/* Sticker marker */}
        <div className={styles.marker} style={{ left: `${stickerPct}%` }}>
          <div className={`${styles.markerLine} ${styles.markerLineSolid}`} />
          <span className={styles.markerLabel}>List</span>
        </div>
      </div>
      <div className={styles.stats}>
        <span className={`${styles.marginAmt} ${styles[zone]}`}>
          ${margin.toFixed(2)} margin
        </span>
        <span className={styles.marginPct}>
          {marginPct.toFixed(0)}% margin
        </span>
      </div>
    </div>
  );
}
