import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS, crossLinks } from "@/components/product/data";
import {
  EcosystemFooter,
  GitIcon,
  NextStep,
  ProductHeader,
  SectionHead,
  Term,
  TermNote,
} from "@/components/product/layout";
import { CodeBlock } from "@/components/product/code";
import { HubDiagram } from "@/components/product/diagram";
import { FeatureIcon, Icons, type IconRow } from "@/components/product/icons";
import { NotificationMock } from "@/components/product/mocks";

const P = PRODUCTS[2];
const REPO = P.repo;
const ZIP = P.zip;
const ORIGIN = "https://fasthandstudio.asia";

export const Route = createFileRoute("/products/fastnotifications")({
  head: () => ({
    meta: [
      {
        title: "Fast Notifications — FCM-free push backend on Cloudflare Workers | FastHand Studio",
      },
      {
        name: "description",
        content:
          "A production-ready push notification backend without Firebase: instant delivery over WebSocket Hibernation, offline queueing in D1, auto-cleanup on acknowledgement.",
      },
      { property: "og:type", content: "product" },
      {
        property: "og:title",
        content: "Fast Notifications — FCM-free push backend on Cloudflare Workers",
      },
      {
        property: "og:description",
        content:
          "Self-hosted push without FCM: instant online delivery, resilient offline queueing, instant reconciliation, zero storage bloat.",
      },
      { property: "og:url", content: `${ORIGIN}/products/fastnotifications` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Fast Notifications",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          codeRepository: REPO,
          url: `${ORIGIN}/products/fastnotifications`,
          description:
            "FCM-independent real-time push notification backend on Cloudflare Workers, Durable Objects and D1.",
        },
      },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fastnotifications` }],
  }),
  component: FastNotifications,
});

const features = [
  {
    t: "Instant online delivery",
    d: "Devices that are connected receive pushes straight down a persistent WebSocket, managed by a per-user coordinator — no polling, no third-party gateway.",
    icon: Icons.flash,
  },
  {
    t: "Resilient offline queue",
    d: "If the device is unreachable, the notification is stored in D1 with status pending instead of being dropped, and nothing is lost while the app is closed.",
    icon: Icons["box-time"],
  },
  {
    t: "Reconcile on reconnect",
    d: "The moment a device's WebSocket opens, every pending message is fetched and delivered — offline turns online with zero user action.",
    icon: Icons["refresh-circle"],
  },
  {
    t: "No storage bloat",
    d: "Once the client displays a notification it sends an acknowledgement, and the record is permanently deleted from the database. Queues drain themselves.",
    icon: Icons["box-remove"],
  },
];

const endpoints = [
  {
    m: "GET",
    p: "/v1/health",
    a: "No",
    d: "Edge worker status and timestamp. Useful as a liveness probe.",
  },
  {
    m: "POST",
    p: "/v1/devices/register",
    a: "No",
    d: "Register an app installation (deviceId, platform) and bind it to a user email.",
  },
  {
    m: "POST",
    p: "/v1/push",
    a: "Bearer",
    d: "Send title/body/custom data to every active device of one user. Falls back to the D1 queue when offline.",
  },
  {
    m: "GET",
    p: "/v1/notifications/pending",
    a: "X-User-Email",
    d: "Fetch all unacknowledged notifications for a user, for offline recovery.",
  },
  {
    m: "POST",
    p: "/v1/notifications/:id/ack",
    a: "No",
    d: "Tell the server the client displayed the notification; the record is deleted permanently.",
  },
  {
    m: "DELETE",
    p: "/v1/devices/:deviceId",
    a: "X-User-Email",
    d: "Unregister one device so it stops receiving pushes.",
  },
  {
    m: "GET (WSS)",
    p: "/v1/ws?userId=…&deviceId=…",
    a: "Registered device",
    d: "The persistent WebSocket stream into the user's NotificationCoordinator.",
  },
];

const setupSteps = [
  {
    t: "Clone and install",
    d: "Node.js 18+ and a Cloudflare account with Workers and D1 enabled.",
    code: "git clone https://github.com/fasthand-studio/FastNotifications.git\ncd FastNotifications\nnpm install",
  },
  {
    t: "Create the D1 database",
    d: "Copy the output database_id into wrangler.toml under [[d1_databases]].",
    code: "npx wrangler d1 create notifications-db",
  },
  {
    t: "Apply the schema migration",
    d: "Create the notifications and devices tables — once locally, once against production.",
    code: [
      "npx wrangler d1 migrations apply notifications-db --local",
      "npx wrangler d1 migrations apply notifications-db --remote",
    ].join("\n"),
  },
  {
    t: "Set the API key secret",
    d: "Your backend will authenticate push requests with this value; it never lives in the repo.",
    code: "npx wrangler secret put API_KEY\n# enter YOUR_API_KEY when prompted",
  },
  {
    t: "Deploy the worker",
    d: "You get an endpoint like https://YOUR-DOMAIN.workers.dev. The repo also ships a complete Android test app you can point at it.",
    code: "npm run deploy",
  },
];

const security: IconRow[] = [
  [
    "Bearer auth on dispatch",
    "Only callers presenting Authorization: Bearer YOUR_API_KEY can push notifications; the key is stored as a Cloudflare secret.",
    Icons.key,
  ],
  [
    "Device binding",
    "WebSocket connections are checked against registered devices (isDeviceRegistered) — an unregistered socket can't join a user's stream.",
    Icons.devices,
  ],
  [
    "Scoped identity headers",
    "Pending-fetch and device-delete calls identify the account via X-User-Email tied to the registered device, not via a bearer token on every client.",
    Icons["profile-circle"],
  ],
  [
    "Ack-then-delete",
    "Acknowledged notifications are removed permanently, so a stolen database copy doesn't accumulate a message history.",
    Icons["box-remove"],
  ],
  [
    "Credentials out of the repo",
    "The API key lives in wrangler secret; wrangler.toml holds only binding names and the database id.",
    Icons.lock,
  ],
];

function FastNotifications() {
  return (
    <div className="min-h-screen">
      <ProductHeader repo={REPO} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Api />
        <Lifecycle />
        <Clients />
        <Setup />
        <Security />
        <Download />
        <Stack />
      </main>
      <EcosystemFooter repo={REPO} crossLinks={crossLinks("fastnotifications")} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <RippleBackdrop />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-28">
        <div>
          <p className="text-sm text-muted-foreground">FastHand Studio &middot; Product</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[64px]">
            Fast Notifications
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
            Push delivery through Google FCM means trusting a third-party pipeline you can't
            self-host. Fast Notifications replaces it: your backend POSTs one JSON body, connected
            devices get it instantly over WebSocket, offline devices get it the second they
            reconnect — all on Cloudflare Workers and D1.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="btn-44 bg-primary text-primary-foreground"
            >
              <GitIcon /> Get the code
            </a>
            <a href="#setup" className="btn-44 border border-border">
              Read the setup guide
            </a>
          </div>
        </div>
        <figure className="mock-tilt justify-self-center">
          <NotificationMock />
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            One POST in, a delivered notification out — no third-party gateway.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function RippleBackdrop() {
  const cx = 930;
  const cy = 250;
  const devices = [
    { x: 660, y: 110 },
    { x: 700, y: 300 },
    { x: 830, y: 420 },
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-border"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {devices.map((d) => (
        <g key={`${d.x}-${d.y}`}>
          <path d={`M${cx} ${cy} L${d.x} ${d.y}`} className="flow-line" stroke="currentColor" />
          <circle cx={d.x} cy={d.y} r={14} stroke="currentColor" />
        </g>
      ))}
      {[90, 160, 230, 310].map((r, i) => (
        <circle
          key={r}
          className="ripple"
          style={{ animationDelay: `${i * -1.75}s` }}
          cx={cx}
          cy={cy}
          r={r}
          stroke="currentColor"
        />
      ))}
      <circle cx={cx} cy={cy} r={7} className="fill-current text-foreground" />
    </svg>
  );
}

function Features() {
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="The service in four cards"
          title="What Fast Notifications does"
          intro="Delivery when online, a queue when offline, automatic catch-up on reconnect, and self-cleaning storage once messages are shown."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.t} className="surface p-6">
              <FeatureIcon C={f.icon} />
              <h3 className="mt-4 text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.d}</p>
            </article>
          ))}
        </div>
        <NextStep href="#how" label="See how a notification travels" />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="One message, two possible paths"
          title="How it works"
          intro="Every push takes the same first two steps, then splits: straight to the device if it's connected, or into the D1 queue until it is. The steps are written out below the diagram."
        />
        <HubDiagram
          source={{ t: "Your backend", d: "POST /v1/push + Bearer key" }}
          hub={{ t: "NotificationCoordinator", d: "Durable Object · one per user" }}
          devices={[
            { t: "Device online", d: "socket open → push frame now" },
            { t: "Device offline", d: "reconnects → queued push lands" },
          ]}
          queue={{ t: "D1 pending queue", d: "status: pending" }}
          caption="Hub-and-spoke: the POST from your backend lands at the user's NotificationCoordinator, which fans out to that user's devices. Messages for offline devices rest in D1 until a socket reopens, then leave the queue on the reconnect path."
          steps={[
            {
              t: "Your backend dispatches",
              d: "One POST /v1/push with the target email, title, body and any custom data, authenticated with your API key.",
            },
            {
              t: "The worker routes to the user",
              d: "The request resolves the user's devices and hands the message to that user's NotificationCoordinator.",
            },
            {
              t: "Coordinator: send now, or queue",
              d: "Registered sockets still open get the push frame instantly; if every device is offline, the message is stored in D1 with status pending.",
            },
            {
              t: "Device shows it and acks",
              d: "The client displays the notification and POSTs the ack route; the coordinator deletes the record, so nothing piles up.",
            },
          ]}
        />
        <TermNote term="Durable Object">
          a per-user actor Cloudflare runs on one machine with its own state — here, one coordinator
          per user owns that user's open WebSockets and device list.
        </TermNote>
        <TermNote term="WebSocket hibernation">
          Cloudflare can detach idle persistent connections from server memory and wake them when a
          message or ping arrives — thousands of open sockets cost almost nothing.
        </TermNote>
        <TermNote term="D1">
          Cloudflare's own SQLite-compatible database that runs at the edge, used here as the
          offline queue.
        </TermNote>
        <NextStep href="#api" label="See the seven endpoints" />
      </div>
    </section>
  );
}

function Api() {
  return (
    <section id="api" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="The whole surface"
          title="Seven API endpoints"
          intro="Six HTTP routes plus one WebSocket stream. The Auth column tells you exactly what each call must carry."
        />
        <div className="surface mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[15px]">
            <caption className="sr-only">
              Fast Notifications endpoints, their authentication requirement and purpose
            </caption>
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Method
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Path
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Auth
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e) => (
                <tr key={e.p + e.m} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4">
                    <span className="whitespace-nowrap rounded-full bg-muted px-3 py-1 font-mono text-xs font-semibold text-foreground">
                      {e.m}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <code className="font-mono text-sm text-foreground">{e.p}</code>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <code className="font-mono text-sm text-muted-foreground">{e.a}</code>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{e.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          <Term
            t="Bearer"
            note="a plain shared-secret header: Authorization: Bearer YOUR_API_KEY"
          />{" "}
          protects server-to-server dispatch; device calls identify themselves with the registered
          email instead.
        </p>
        <NextStep href="#lifecycle" label="Follow a device's life cycle" />
      </div>
    </section>
  );
}

function Lifecycle() {
  return (
    <section id="lifecycle" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Register to receive, ack to delete"
          title="How a client actually uses it"
          intro="Four moves make any app a reliable notification receiver. The push frame format is shown after the steps."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {(
            [
              [
                "Register the device",
                "POST /v1/devices/register with the user's email (use user@example.com in tests), a unique deviceId and the platform. The response returns the userId you'll connect with.",
                Icons["box-tick"],
              ],
              [
                "Open the WebSocket",
                "Connect to wss://YOUR-DOMAIN.workers.dev/v1/ws?userId=…&deviceId=…. Only registered devices pass verification.",
                Icons["link-2"],
              ],
              [
                "Keep it alive",
                'Send a ping frame (or the text "ping") periodically — the Kotlin example does every 20 seconds — and expect "pong". On open, immediately fetch pending notifications.',
                Icons.activity,
              ],
              [
                "Display, then acknowledge",
                "When a push frame arrives, show it and POST /v1/notifications/:id/ack. The record is deleted; the queue stays empty on purpose.",
                Icons["tick-square"],
              ],
            ] as IconRow[]
          ).map(([t, d, ic], i) => (
            <li key={t} className="surface p-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <FeatureIcon C={ic} px={28} />
                <h3 className="text-lg font-semibold">{t}</h3>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
        <div className="surface mt-4 p-6">
          <h3 className="text-lg font-semibold">The push frame on the wire</h3>
          <CodeBlock
            label="One JSON message per notification, sent down the socket"
            code={[
              "{",
              '  "type": "push",',
              '  "id": "e2c608f5-f8c6-4cbf-8b2b-65e3c7ba3380",',
              '  "title": "New order #1042",',
              '  "body": "You have received a new order for ৳ 1,850.00",',
              '  "data": { "orderId": "1042", "sound": "loud_alert" },',
              '  "timestamp": 1726756800000',
              "}",
            ].join("\n")}
          />
        </div>
        <NextStep href="#clients" label="See the included Android app" />
      </div>
    </section>
  );
}

function Clients() {
  return (
    <section id="clients" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Not only a server"
          title="A working Android client is in the repo"
          intro="test-app-kotlin is a complete Kotlin example, not a snippet — the same code the API was verified against."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [
                "Sticky foreground service",
                "PushNotificationService.kt keeps the socket alive with FOREGROUND_SERVICE_DATA_SYNC.",
                Icons.wifi,
              ],
              [
                "Self-healing connection",
                "OkHttp WebSocket with automatic exponential reconnection and keep-alive pings.",
                Icons.refresh,
              ],
              [
                "Impossible to miss",
                "A high-priority notification channel with a custom loud sound and vibration pattern.",
                Icons["notification-bing"],
              ],
              [
                "Offline recovery hook",
                "fetchPending fires on WebSocket onOpen, so reconnecting users catch up instantly.",
                Icons["box-time"],
              ],
            ] as IconRow[]
          ).map(([t, d, ic]) => (
            <article key={t} className="surface hover-lift p-5">
              <FeatureIcon C={ic} px={30} />
              <h3 className="mt-4 text-[15px] font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <NextStep href="#setup" label="Deploy it yourself" />
      </div>
    </section>
  );
}

function Setup() {
  return (
    <section id="setup" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Steps only, placeholders only"
          title="Set it up in five steps"
          intro="Clone, create a D1 database, apply the migration, set one secret, deploy. Every value below is a placeholder."
        />
        <ol className="mt-10 grid gap-4 lg:grid-cols-2">
          {setupSteps.map((s, i) => (
            <li key={s.t} className="surface p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold">{s.t}</h3>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">{s.d}</p>
              <CodeBlock code={s.code} label={`${s.t} — example`} />
            </li>
          ))}
        </ol>
        <div className="surface mt-4 p-6">
          <h3 className="text-lg font-semibold">Dispatching a push from your backend</h3>
          <CodeBlock
            label="Example request"
            code={[
              "curl -X POST https://YOUR-DOMAIN.workers.dev/v1/push \\",
              '  -H "Authorization: Bearer YOUR_API_KEY" \\',
              '  -H "Content-Type: application/json" \\',
              "  -d '{",
              '    "email": "user@example.com",',
              '    "title": "New order #1042",',
              '    "body": "You have received a new order",',
              '    "data": { "orderId": "1042", "sound": "loud_alert" }',
              "  }'",
            ].join("\n")}
          />
        </div>
        <NextStep href="#security" label="See how it's secured" />
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="security" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Who may push, and who may listen"
          title="Security"
          intro="Two different callers — your backend and user devices — get two different checks. Neither one runs unverified."
        />
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {security.map(([t, d, ic]) => (
            <li key={t} className="grid gap-1 py-5 md:grid-cols-[260px_1fr] md:gap-8">
              <span className="flex items-center gap-3 font-semibold">
                <FeatureIcon C={ic} px={26} />
                {t}
              </span>
              <span className="text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>
        <NextStep href="#download" label="Get the code" />
      </div>
    </section>
  );
}

function Download() {
  return (
    <section id="download" className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-3xl font-semibold tracking-tight">Get Fast Notifications</h2>
        <p className="mt-3 max-w-xl opacity-70">
          MIT-licensed under the FastHand Studio organization. There is no hosted service to sign up
          for: {P.host}, on your own Cloudflare account, with your own API key.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="btn-44 bg-primary-foreground text-primary"
          >
            <GitIcon /> View on GitHub
          </a>
          <a
            href={ZIP}
            className="btn-44 border border-primary-foreground/30 text-primary-foreground"
          >
            Download ZIP
          </a>
        </div>
        <NextStep href="#stack" label="Check the stack" />
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Why these four pieces"
          title="Stack &amp; architecture"
          intro="Everything is Cloudflare-native and self-contained — one worker, one database, one actor class, one test app."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [
                "Cloudflare Workers",
                "TypeScript entrypoint (src/index.ts) handles routing, auth and middleware.",
                Icons.cloud,
              ],
              [
                "Durable Objects",
                "NotificationCoordinator: one per user, owning that user's hibernating WebSockets.",
                Icons.cpu,
              ],
              [
                "D1",
                "SQLite at the edge: devices, users and the pending-notification queue.",
                Icons["bucket-square"],
              ],
              [
                "test-app-kotlin",
                "A full Android client that proves the protocol end to end.",
                Icons.monitor,
              ],
            ] as IconRow[]
          ).map(([t, d, ic]) => (
            <article key={t} className="surface hover-lift p-5">
              <FeatureIcon C={ic} px={30} />
              <h3 className="mt-4 font-mono text-[15px] font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
