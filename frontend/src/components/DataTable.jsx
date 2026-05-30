export default function DataTable({ title, subtitle, columns, rows, emptyMessage }) {
  return (
    <section className="table-card">
      <header className="table-header">
        <div>
          <h2 className="table-title">{title}</h2>
          {subtitle && <p className="table-subtitle">{subtitle}</p>}
        </div>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.align === "right" ? "align-right" : ""}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  {emptyMessage || "No data available"}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.align === "right" ? "align-right" : ""}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
