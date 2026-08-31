"use client";

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

function UnitButton({ unit, selected, onToggle }) {
  const isSelected = selected.includes(unit.id);
  const state = isSelected ? "selected" : unit.status;
  const disabled = unit.status === "reserved" || unit.status === "booked";

  return (
    <button
      type="button"
      className={`seat-unit ${state}`}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`${unit.id} ${state}`}
      title={[
        unit.position,
        unit.exitRow ? "Exit row" : "",
        unit.capacity > 1 ? `Capacity ${unit.capacity}` : "",
      ].filter(Boolean).join(" • ")}
      onClick={() => onToggle(unit.id)}
    >
      <strong>{unit.label || unit.id}</strong>
      {unit.exitRow && <small>EXIT</small>}
      {unit.kind === "cabin" && <small>{unit.capacity} pax</small>}
      {unit.position && unit.kind !== "cabin" && <small>{unit.position}</small>}
    </button>
  );
}

export default function SeatMap({ units = [], selected = [], onChange }) {
  const sections = groupBy(units, (unit) => unit.section || "Seats");

  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter((seatId) => seatId !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="seat-selector">
      <div className="seat-legend">
        <span><i className="seat-key available" /> Available</span>
        <span><i className="seat-key selected" /> Selected</span>
        <span><i className="seat-key reserved" /> Reserved</span>
        <span><i className="seat-key booked" /> Booked</span>
      </div>

      {Object.entries(sections).map(([sectionName, sectionUnits]) => {
        const hasRows = sectionUnits.some((unit) => Number.isInteger(unit.row));

        if (!hasRows) {
          return (
            <section className="seat-section" key={sectionName}>
              <div className="seat-section-title">
                <h4>{sectionName}</h4>
                <span>{sectionUnits.length} units</span>
              </div>

              <div className="seat-unit-grid">
                {sectionUnits.map((unit) => (
                  <UnitButton
                    key={unit.id}
                    unit={unit}
                    selected={selected}
                    onToggle={toggle}
                  />
                ))}
              </div>
            </section>
          );
        }

        const rows = groupBy(sectionUnits, (unit) => String(unit.row));

        return (
          <section className="seat-section" key={sectionName}>
            <div className="seat-section-title">
              <h4>{sectionName}</h4>
              <span>{sectionUnits.length} seats</span>
            </div>

            <div className="vehicle-front">Front</div>

            <div className="seat-rows">
              {Object.entries(rows).map(([rowNumber, rowUnits]) => {
                const sorted = [...rowUnits].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                const left = sorted.filter((unit) => unit.side === "left");
                const right = sorted.filter((unit) => unit.side === "right");
                const exitRow = sorted.some((unit) => unit.exitRow);

                return (
                  <div className={`seat-row ${exitRow ? "exit-row" : ""}`} key={rowNumber}>
                    <span className="seat-row-number">{rowNumber}</span>

                    <div className="seat-side left">
                      {left.map((unit) => (
                        <UnitButton
                          key={unit.id}
                          unit={unit}
                          selected={selected}
                          onToggle={toggle}
                        />
                      ))}
                    </div>

                    <div className="seat-aisle">
                      {exitRow ? <b>EXIT</b> : <span>aisle</span>}
                    </div>

                    <div className="seat-side right">
                      {right.map((unit) => (
                        <UnitButton
                          key={unit.id}
                          unit={unit}
                          selected={selected}
                          onToggle={toggle}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
