export function Art({ type = 'hero' }) {
  if (type === 'hero')
    return (
      <svg viewBox="0 0 520 320" role="img" aria-label="Abstract system map">
        <g fill="none" stroke="currentColor">
          <path
            d="M54 160h104m52 0h84m54 0h118M158 160V74m136 86V74m-136 86v86m136-86v86"
            strokeDasharray="4 7"
            opacity=".55"
          />
          <rect x="54" y="128" width="104" height="64" rx="2" />
          <rect x="210" y="128" width="84" height="64" rx="2" />
          <rect x="348" y="128" width="116" height="64" rx="2" />
          <circle cx="158" cy="160" r="6" fill="var(--accent)" />
          <circle cx="294" cy="160" r="6" fill="var(--violet)" />
          <rect x="128" y="44" width="60" height="58" />
          <rect x="264" y="44" width="60" height="58" />
          <rect x="128" y="218" width="60" height="58" />
          <rect x="264" y="218" width="60" height="58" />
        </g>
        <g fill="currentColor" fontFamily="monospace" fontSize="9">
          <text x="75" y="164">
            REQUEST
          </text>
          <text x="225" y="164">
            SERVICE
          </text>
          <text x="370" y="164">
            DATABASE
          </text>
          <text x="139" y="77">
            QUEUE
          </text>
          <text x="274" y="77">
            CACHE
          </text>
          <text x="135" y="250">
            METRICS
          </text>
          <text x="274" y="250">
            WORKERS
          </text>
        </g>
      </svg>
    )
  if (type === 'database')
    return (
      <svg viewBox="0 0 360 210" className="thumb-svg">
        <ellipse cx="180" cy="50" rx="66" ry="22" fill="none" stroke="currentColor" />
        <path
          d="M114 50v105c0 12 30 22 66 22s66-10 66-22V50M114 85c0 12 30 22 66 22s66-10 66-22M114 120c0 12 30 22 66 22s66-10 66-22"
          fill="none"
          stroke="currentColor"
        />
        <circle cx="280" cy="65" r="6" fill="var(--accent)" />
        <path d="M246 65h28" stroke="var(--accent)" />
      </svg>
    )
  if (type === 'stack')
    return (
      <svg viewBox="0 0 360 210" className="thumb-svg blue-art">
        <g fill="none" stroke="currentColor">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${48 + i * 34} ${38 + i * 9})`}>
              <path d="m0 34 53-28 58 28-58 28zM0 34v49l53 29V62M53 62l58-28v49l-58 29" />
            </g>
          ))}
        </g>
      </svg>
    )
  if (type === 'blocks')
    return (
      <svg viewBox="0 0 360 210" className="thumb-svg blocks-art">
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M50 55h86v86H50zM224 72h78v78h-78zM136 97h88" />
          <circle cx="93" cy="98" r="13" fill="var(--violet)" />
          <circle cx="263" cy="111" r="13" fill="var(--accent)" />
        </g>
      </svg>
    )
  if (type === 'network')
    return (
      <svg viewBox="0 0 360 210" className="thumb-svg">
        <g fill="none" stroke="currentColor">
          <path d="m60 52 75 48 75-48 88 50-75 58-88-10-75 10zM135 100l88 58M210 52l13 106" />
        </g>
        {[
          [60, 52],
          [135, 100],
          [210, 52],
          [298, 102],
          [223, 158],
          [135, 148],
          [60, 158],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill={i % 2 ? 'var(--accent)' : 'var(--violet)'} />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 360 210" className="thumb-svg">
      <circle cx="180" cy="105" r="65" fill="none" stroke="currentColor" />
      <circle cx="180" cy="105" r="36" fill="none" stroke="var(--accent)" />
      <ellipse
        cx="180"
        cy="105"
        rx="105"
        ry="38"
        fill="none"
        stroke="currentColor"
        transform="rotate(-25 180 105)"
      />
      <circle cx="83" cy="60" r="6" fill="var(--accent)" />
    </svg>
  )
}
