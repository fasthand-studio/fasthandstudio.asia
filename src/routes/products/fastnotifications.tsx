import { createFileRoute } from "@tanstack/react-router";
import { GITHUB_ORG } from "@/lib/github.functions";
import { CodeBlock } from "@/components/product/CodeBlock";
import { PhoneQueueScene, SceneFigure, SocketLineScene } from "@/components/product/scenes";
import { Gloss, NextStep } from "@/components/product/gloss";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductEcosystemFooter } from "@/components/product/ProductEcosystemFooter";
import { GitIcon, DownloadIcon } from "@/components/product/icons";
import { TreeIcon, type TreeIconName } from "@/components/product/TreeIcon";

const ORIGIN = "https://fasthandstudio.asia";
const REPO = "FastNotifications";
const REPO_URL = `https://github.com/${GITHUB_ORG}/${REPO}`;
const ZIP_URL = `${REPO_URL}/archive/refs/heads/main.zip`;
const KOTLIN_URL = `${REPO_URL}/tree/main/test-app-kotlin`;

const TITLE = "FastNotifications — self-hosted push notifications without Firebase";
const DESCRIPTION =
  "FastNotifications is an open-source push backend on Cloudflare Workers: WebSocket delivery through a per-user Durable Object, a D1 offline queue, and automatic cleanup on ACK.";

export const Route = createFileRoute("/products/fastnotifications")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:site_name", content: "FastHand Studio" },
      { property: "og:url", content: `${ORIGIN}/products/fastnotifications` },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${ORIGIN}/og.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${ORIGIN}/og.png` },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fastnotifications` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FastNotifications",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Cloudflare Workers",
          description: DESCRIPTION,
          url: `${ORIGIN}/products/fastnotifications`,
          codeRepository: REPO_URL,
          license: "https://opensource.org/licenses/MIT",
          isPartOf: { "@id": `${ORIGIN}/#website` },
          publisher: { "@id": `${ORIGIN}/#organization` },
        }),
      },
    ],
  }),
  component: FastNotificationsPage,
});

type Feature = {
  t: string;
  /** IconTree id, rendered through the per-icon registry in TreeIcon.tsx. */
  i: TreeIconName;
  d: string;
  k: string;
  g: { term: string; note: string };
};

const features: Feature[] = [
  {
    t: "Online devices are notified instantly",
    i: "notification",
    d: "The notification is written straight to the socket the device already has open. No polling, no third-party relay, no waiting for the next sync.",
    k: "WebSocket per user",
    g: {
      term: "Durable Object",
      note: "a small stateful worker that Cloudflare pins to one user, so it can hold that user's socket open and remember it.",
    },
  },
  {
    t: "Offline devices get queued, not dropped",
    i: "data",
    d: "If no socket is open, the notification is saved with status pending instead of disappearing. A phone that is switched off for six hours loses nothing.",
    k: 'status: "pending"',
    g: {
      term: "Cloudflare D1",
      note: "Cloudflare's own SQL database. The queue lives in the same account as the Worker, so there is no second service to run.",
    },
  },
  {
    t: "On reconnect the queue replays itself",
    i: "refresh",
    d: "When the socket opens again the client asks for what it missed and receives every unacknowledged notification, in the order it was sent.",
    k: "GET /v1/notifications/pending",
    g: {
      term: "Reconciliation",
      note: "comparing what the server stored against what the device has seen, and sending only the difference.",
    },
  },
  {
    t: "After an ack the record is deleted",
    i: "trash",
    d: "Once the device has shown the notification it confirms the id, and that row is removed from the database permanently. Storage does not grow just because you sent things.",
    k: "POST /v1/notifications/:id/ack",
    g: {
      term: "ACK",
      note: 'short for acknowledgement: the client\'s receipt that says "the user saw this", which is what makes deleting the row safe.',
    },
  },
];

const clientBehaviours: { t: string; i: TreeIconName; d: string }[] = [
  {
    t: "Stays running in the background",
    i: "android",
    d: "A sticky foreground service declares itself as data-sync work, so Android keeps the socket alive after you leave the screen.",
  },
  {
    t: "Reconnects itself, gently",
    i: "refresh",
    d: "On failure it waits, retries, and doubles the wait each time, so a long outage does not turn into a burst of requests.",
  },
  {
    t: "Actually makes noise",
    i: "notification",
    d: "A high-priority notification channel with its own loud sound and vibration pattern, because a silent notification is not a notification.",
  },
  {
    t: "Catches up on open",
    i: "data",
    d: "The moment the socket opens it fetches pending notifications, so a reconnect flushes the queue without the user doing anything.",
  },
];

const endpoints = [
  { m: "GET", p: "/v1/health", a: "No", d: "Worker liveness and server timestamp." },
  { m: "POST", p: "/v1/devices/register", a: "No", d: "Bind a device id to a user email." },
  {
    m: "POST",
    p: "/v1/push",
    a: "Bearer YOUR_API_KEY",
    d: "Deliver to a user's registered devices, or queue the row.",
  },
  {
    m: "GET",
    p: "/v1/notifications/pending",
    a: "X-User-Email",
    d: "Unacknowledged notifications waiting for one user.",
  },
  {
    m: "POST",
    p: "/v1/notifications/:id/ack",
    a: "No",
    d: "Confirm the client showed it, then permanently delete the row.",
  },
  { m: "DELETE", p: "/v1/devices/:deviceId", a: "X-User-Email", d: "Unregister a device." },
  {
    m: "GET",
    p: "/v1/ws?userId=…&deviceId=…",
    a: "Registered device",
    d: "The WebSocket stream itself, over wss.",
  },
];

const PUSH_REQUEST = `curl -X POST https://YOUR-DOMAIN.workers.dev/v1/push \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "title": "New order #1042",
    "body": "An order arrived while you were away.",
    "data": { "orderId": "1042", "sound": "loud_alert" }
  }'`;

const PUSH_RESPONSE = `{
  "success": true,
  "status": "delivered",
  "notificationId": "3f2a1c98-6d47-4b0e-9a21-5c8e0d7f4b62"
}`;

const WS_FRAME = `{
  "type": "push",
  "id": "3f2a1c98-6d47-4b0e-9a21-5c8e0d7f4b62",
  "title": "New order #1042",
  "body": "An order arrived while you were away.",
  "data": { "orderId": "1042", "sound": "loud_alert" },
  "timestamp": 1726756800000
}`;

const HEARTBEAT = `wss://YOUR-DOMAIN.workers.dev/v1/ws?userId=USER_ID&deviceId=DEVICE_ID

  →  "ping"      // client, every 20-30s while idle
  ←  "pong"      // worker, connection is still healthy`;

const KOTLIN = `private val client = OkHttpClient.Builder()
    .pingInterval(20, TimeUnit.SECONDS)     // keep-alive while the socket is idle
    .retryOnConnectionFailure(true)         // exponential reconnect
    .build()

fun connect(userId: String, deviceId: String) {
    val request = Request.Builder()
        .url("wss://YOUR-DOMAIN.workers.dev/v1/ws?userId=$userId&deviceId=$deviceId")
        .build()

    client.newWebSocket(request, object : WebSocketListener() {
        override fun onOpen(socket: WebSocket, response: Response) {
            fetchPendingNotifications()     // recover anything queued offline
        }

        override fun onMessage(socket: WebSocket, text: String) {
            val item = parseNotification(text)
            showNotification(item)          // high-priority channel
            acknowledge(item.id)            // deletes the D1 row
        }
    })
}`;

const SETUP = `git clone ${REPO_URL}.git
cd FastNotifications
npm install

npx wrangler d1 create notifications-db
# paste the returned database_id into wrangler.toml under [[d1_databases]]

npx wrangler d1 migrations apply notifications-db --local
npx wrangler d1 migrations apply notifications-db --remote

npx wrangler secret put API_KEY
npm run deploy`;

function FastNotificationsPage() {
  return (
    <div id="top" className="min-h-screen">
      <ProductHeader
        repoUrl={REPO_URL}
        pageNav={[
          { href: "#features", label: "Features" },
          { href: "#how", label: "How it works" },
          { href: "#api", label: "API" },
          { href: "#setup", label: "Setup" },
        ]}
      />
      <main>
        <Hero />
        <OpeningScene />
        <Features />
        <HowItWorks />
        <Api />
        <Realtime />
        <Android />
        <Setup />
        <Download />
        <Stack />
      </main>
      <ProductEcosystemFooter current="FastNotifications" />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-24">
      <div>
        <p className="font-mono text-sm text-muted-foreground">FastHand Studio · Product</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[56px]">
          FastNotifications
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          The normal way to notify a phone is a vendor service: an account, a project id, and a
          delivery path you cannot read or run yourself. FastNotifications replaces it with one
          Cloudflare Worker — a Durable Object holds each user's socket open, a D1 table holds
          anything sent while they are away, and the whole guarantee is code you can inspect.
        </p>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          The repository contains the Worker, the D1 schema, the admin-key middleware, the device
          registration check, the reconnection replay, and a Kotlin test app.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#setup" className="btn-44 bg-primary text-primary-foreground">
            Set it up
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-44 border border-border"
          >
            <GitIcon /> Get the code
          </a>
          <a href="#api" className="btn-44 border border-border">
            Read the API
          </a>
        </div>
        <p className="mt-6 font-mono text-[13px] text-muted-foreground">
          Workers · Durable Objects · D1 · TypeScript · MIT
        </p>
      </div>
      <BroadcastMark />
    </section>
  );
}

/** The premise, drawn: a device that nobody is holding, and the queue waiting above it. */
function OpeningScene() {
  return (
    <section aria-label="What this system is for" className="mx-auto max-w-6xl px-5 md:px-8">
      <SceneFigure caption="Figure 1. A phone lying flat, screen dark, with its notifications held in order above it. Every guarantee below is about the messages that arrive while nobody is holding the device.">
        <PhoneQueueScene />
      </SceneFigure>
    </section>
  );
}

function BroadcastMark() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px]" aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full text-foreground">
        <g className="fill-none stroke-border" strokeWidth="1.5">
          <circle className="broadcast-ring" cx="200" cy="200" r="150" />
          <circle className="broadcast-ring delay-1" cx="200" cy="200" r="150" />
          <circle className="broadcast-ring delay-2" cx="200" cy="200" r="150" />
        </g>
        <circle cx="200" cy="200" r="104" className="fill-none stroke-border" strokeWidth="1.5" />
        <rect
          x="160"
          y="146"
          width="80"
          height="108"
          rx="20"
          className="fill-card stroke-foreground"
          strokeWidth="1.5"
          style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
        />
        <path
          d="M200 168c-11 0-19 8-19 19v13l-7 11h52l-7-11v-13c0-11-8-19-19-19z"
          className="fill-foreground"
        />
        <circle cx="200" cy="222" r="5" className="fill-foreground" />
        <rect x="188" y="236" width="24" height="3" rx="1.5" className="fill-foreground" />
      </svg>
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  lead,
  children,
  tone = "plain",
}: {
  id?: string;
  kicker: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  tone?: "plain" | "muted";
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 border-t border-border ${tone === "muted" ? "bg-secondary" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-muted-foreground">{kicker}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
          {lead && <p className="mt-3 leading-relaxed text-muted-foreground">{lead}</p>}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <Section
      id="features"
      kicker="What it does"
      title="Four guarantees, with no push service in the middle"
      lead="Every notification either reaches a device now or is kept until it can. Here is what the code promises, one card each."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <article key={f.t} className="surface flex flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <TreeIcon name={f.i} size={24} motion="hover" />
              <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold">{f.t}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{f.d}</p>
            <Gloss term={f.g.term} note={f.g.note} />
            <p className="mt-5 font-mono text-[12px] break-words text-muted-foreground">{f.k}</p>
          </article>
        ))}
      </div>
      <NextStep href="#how" action="See the flow">
        Next: the same four guarantees as one path a notification travels.
      </NextStep>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section
      id="how"
      kicker="How it works"
      title="One path: register, push, deliver, delete"
      lead="Follow a single notification from the moment a device signs up to the moment its record disappears. The route is the same whether the device is awake or has been offline for a day; only the middle branch changes."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <figure className="surface self-start p-5 md:p-6">
          <svg
            viewBox="0 0 380 620"
            className="mx-auto w-full max-w-[420px] text-foreground md:max-w-[380px]"
            role="img"
            aria-labelledby="flow-title flow-desc"
          >
            <title id="flow-title">FastNotifications delivery flow</title>
            <desc id="flow-desc">
              A device registers with an email and device id. A backend sends a push. The
              NotificationCoordinator Durable Object checks the device is registered, then either
              writes the frame to an open WebSocket or stores a pending row in D1. On reconnect the
              client fetches pending notifications, and its acknowledgement deletes the row.
            </desc>
            <defs>
              <marker
                id="flow-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
              </marker>
            </defs>

            <FlowNode
              y={4}
              title="1 · Device registers"
              lines={["POST /v1/devices/register", "email + deviceId bound to a user"]}
            />
            <FlowArrow y1={78} y2={102} />
            <FlowNode
              y={104}
              title="2 · Backend pushes"
              lines={["POST /v1/push", "Authorization: Bearer YOUR_API_KEY"]}
            />
            <FlowArrow y1={178} y2={202} />
            <FlowNode
              y={204}
              title="3 · Durable Object"
              lines={["NotificationCoordinator, one per user", "is the device registered?"]}
            />

            {/* one user, two outcomes: live socket or D1 queue */}
            <path
              d="M190 278 L190 298 M102 298 L278 298"
              className="stroke-foreground"
              strokeWidth="1.5"
            />
            <FlowArrow x={102} y1={298} y2={318} />
            <FlowArrow x={278} y1={298} y2={318} />

            <FlowNode
              x={18}
              w={168}
              y={320}
              title="4a · Online"
              lines={["socket already open", "frame { type: push }", "shown immediately"]}
            />
            <FlowNode
              x={194}
              w={168}
              y={320}
              title="4b · Offline"
              lines={["no open socket", "D1 row stored", "status = pending"]}
            />

            <FlowArrow x={102} y1={394} y2={420} />
            <FlowArrow x={278} y1={394} y2={420} />
            <FlowNode
              y={422}
              title="5 · Reconnect replays"
              lines={["GET /v1/notifications/pending", "queued rows arrive in order"]}
            />
            <FlowArrow y1={496} y2={520} />
            <FlowNode
              y={522}
              title="6 · Client acknowledges"
              lines={["POST /v1/notifications/:id/ack", "the D1 row is deleted"]}
            />
          </svg>
          <figcaption className="mt-4 border-t border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">
            Figure 2. The journey of one notification. Step 3 is where the two outcomes split: an
            open socket delivers now, a closed one stores the row until the device returns.
          </figcaption>
        </figure>

        <div>
          <h3 className="text-lg font-semibold">The same flow, in words</h3>
          <p className="mt-2 text-[15px] text-muted-foreground">
            The written version of Figure 2, for reading on a small screen or with a screen reader.
          </p>
          <ol className="mt-4 grid gap-3">
            {[
              [
                "1 · Register once",
                "The app posts its email and device id. From then on, only a device that registered can open that user's socket.",
              ],
              [
                "2 · Push from anywhere",
                "Any server holding the API key can send to a user. No SDK, no vendor quota, no project id to register with Google.",
              ],
              [
                "3 · The user's object decides",
                "One Durable Object per user holds their connections, so delivering to that user's devices is a local loop, not a network hunt.",
              ],
              [
                "4a · If the socket is open",
                "The frame goes down the existing WebSocket and the device shows it immediately.",
              ],
              [
                "4b · If it is not",
                "The notification is written to D1 as pending and simply waits. Nothing is lost while the device is off.",
              ],
              [
                "5 · Reconnect replays the queue",
                "When the socket opens again the client requests /v1/notifications/pending and receives everything it missed, in the order it was sent.",
              ],
              [
                "6 · Ack deletes the record",
                "After showing the notification the client sends the ack, and that row is removed. The table returns to empty instead of growing forever.",
              ],
            ].map(([t, d]) => (
              <li
                key={t}
                className="grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-border py-3 first:border-t"
              >
                <span className="font-mono text-[13px] font-semibold text-foreground">{t}</span>
                <span className="text-[15px] leading-relaxed text-muted-foreground">{d}</span>
              </li>
            ))}
          </ol>
          <Gloss
            term="WebSocket hibernation"
            note="Cloudflare can suspend an idle connection and wake it only when something is actually sent, so a thousand waiting devices do not cost a thousand running processes."
          />
          <NextStep href="#api" action="Read the API">
            Next: the seven calls that make this path happen.
          </NextStep>
        </div>
      </div>
    </Section>
  );
}

function FlowNode({
  x = 16,
  w = 348,
  y,
  title,
  lines,
}: {
  x?: number;
  w?: number;
  y: number;
  title: string;
  lines: string[];
}) {
  const h = 74;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="18"
        className="fill-secondary stroke-border"
        strokeWidth="1.5"
        style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
      />
      <text x={x + 16} y={y + 26} className="fill-foreground" fontSize="15" fontWeight="600">
        {title}
      </text>
      {lines.map((l, i) => (
        <text
          key={l}
          x={x + 16}
          y={y + 46 + i * 15}
          className="fill-muted-foreground"
          fontSize="12.5"
        >
          {l}
        </text>
      ))}
    </g>
  );
}

function FlowArrow({ x = 190, y1, y2 }: { x?: number; y1: number; y2: number }) {
  return (
    <path
      d={`M${x} ${y1} L${x} ${y2}`}
      className="stroke-foreground"
      strokeWidth="1.5"
      markerEnd="url(#flow-arrow)"
    />
  );
}

function Api() {
  return (
    <Section
      id="api"
      kicker="How to use it"
      title="Seven endpoints, and only one of them sends anything"
      lead="Everything below is the complete interface. One call comes from your backend (/v1/push), five come from the device, and /v1/health exists only to prove the Worker is answering."
      tone="muted"
    >
      <h3 className="sr-only">Endpoint reference</h3>
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <caption className="sr-only">
            FastNotifications HTTP API: method, path, what each endpoint expects for authentication,
            and what it does
          </caption>
          <thead>
            <tr className="border-b border-border">
              {["Method", "Path", "Auth", "What it does"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-[13px] font-semibold text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {endpoints.map((e) => (
              <tr key={e.p} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3">
                  <span className="font-mono text-[13px] font-semibold">{e.m}</span>
                </td>
                <td className="px-4 py-3 font-mono text-[13px] break-words">{e.p}</td>
                <td className="px-4 py-3 font-mono text-[12px] break-words text-muted-foreground">
                  {e.a}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-0 sm:grid-cols-2 sm:gap-6">
        <Gloss
          term="Authorization: Bearer YOUR_API_KEY"
          note="the server-to-server password, sent as a header. Only /v1/push needs it, because only that call is allowed to create a notification."
        />
        <Gloss
          term="X-User-Email"
          note="a header the device sends to say whose queue it is reading. The email is the account key: it is hashed into the user id the Durable Object is addressed by."
        />
      </div>

      <h3 className="mt-12 text-lg font-semibold">Send a notification</h3>
      <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
        One request carries the whole payload: who receives it, what to show, and any extra data the
        app wants. The response tells you which of the two outcomes happened.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CodeBlock
          label="POST /v1/push"
          code={PUSH_REQUEST}
          note="Replace YOUR-DOMAIN and YOUR_API_KEY with your own Worker domain and secret."
        />
        <CodeBlock
          label="200 OK"
          code={PUSH_RESPONSE}
          note={`status is "delivered" if a socket was open and the frame went out, "queued" if the row is waiting in D1.`}
        />
      </div>
      <NextStep href="#realtime" action="See the live stream">
        Next: what the device actually receives on its open socket.
      </NextStep>
    </Section>
  );
}

function Realtime() {
  return (
    <Section
      id="realtime"
      kicker="Real-time stream"
      title="The socket carries exactly one kind of message"
      lead="A client never has to interpret a protocol. One frame type arrives, it contains everything needed to show a notification, and the only other traffic is a keep-alive."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeBlock
          label='frame type "push"'
          code={WS_FRAME}
          note="The id in this frame is the same id you acknowledge later, so the delete always matches the row that was shown."
        />
        <CodeBlock
          label="GET /v1/ws"
          code={HEARTBEAT}
          note={'Send a WebSocket ping frame or the text "ping"; the Worker answers "pong".'}
        />
      </div>
      <div className="mt-6 grid gap-0 sm:grid-cols-2 sm:gap-6">
        <Gloss
          term="Frame"
          note="one complete message on a WebSocket. Here every frame is JSON with a type field, and the only type the server sends is push."
        />
        <Gloss
          term="Ping / pong heartbeat"
          note="a two-way check that costs almost nothing. It proves the path is still open, so a dead connection is noticed by the client instead of by a missing notification."
        />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            While nothing is being sent, the Durable Object hibernates: Cloudflare keeps the
            connection registered but stops charging for a running process. A push wakes it, the
            frame goes out on the socket that already exists, and it sleeps again.
          </p>
          <p className="mt-6 text-[15px] font-semibold text-foreground">The same wake, in words</p>
          <ol className="mt-3 grid gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
            {[
              "The socket stays registered while the object idles. No process runs, so nothing is billed.",
              "A POST to /v1/push names that user, which starts the object again on the first request.",
              "The frame is written to the connection that never closed, so the phone shows it at once.",
              "The object idles again. The next push repeats the same four steps.",
            ].map((s, i) => (
              <li key={s} className="grid grid-cols-[24px_1fr] gap-3">
                <span className="font-mono text-[13px] text-foreground">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <SceneFigure caption="Figure 3. A line stays on the crossarm whether or not anyone is on it, and the spare is coiled at the side. A hibernating socket is the same object: registered, idle, and one request away from carrying traffic.">
          <SocketLineScene />
        </SceneFigure>
      </div>
      <NextStep href="#android" action="See the Android client">
        Next: the client side that keeps that socket alive.
      </NextStep>
    </Section>
  );
}

function Android() {
  return (
    <Section
      id="android"
      kicker="The reference client"
      title="A Kotlin client that stays connected"
      lead="test-app-kotlin is a complete runnable app, not a snippet. It is the reference for the reconnect behaviour the backend expects."
      tone="muted"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <article className="surface flex h-full flex-col p-6">
          <h3 className="text-lg font-semibold">What the sample app solves</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            A socket in an Android app dies when the screen locks or the activity is closed. These
            four pieces are what make it survive that.
          </p>
          <ul className="mt-5 flex-1 grid gap-5 text-[15px]">
            {clientBehaviours.map((c) => (
              <li key={c.t} className="grid grid-cols-[24px_1fr] items-start gap-3">
                <TreeIcon name={c.i} size={22} motion="static" className="mt-0.5" />
                <span>
                  <span className="block font-semibold text-foreground">{c.t}</span>
                  <span className="mt-1 block leading-relaxed text-muted-foreground">{c.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-0">
            <Gloss
              term="Foreground service"
              note="an Android process the system keeps running because it is visibly listed as ongoing work. Without it, the socket is closed as soon as the app is backgrounded."
            />
            <Gloss
              term="OkHttp"
              note="Android's standard HTTP client. Its WebSocket support is what provides pingInterval and automatic reconnect above."
            />
          </div>
          <a
            href={KOTLIN_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-32 mt-6 self-start border border-border"
          >
            Open test-app-kotlin
          </a>
        </article>
        <CodeBlock
          label="PushNotificationService.kt"
          code={KOTLIN}
          note="Trimmed to the connection and recovery path. The full service is in the repository."
        />
      </div>
      <NextStep href="#setup" action="Deploy it yourself">
        Next: the six steps that put this Worker on your own Cloudflare account.
      </NextStep>
    </Section>
  );
}

function Setup() {
  const steps = [
    ["Clone the repository", "The Worker, the migrations and the Android sample are all in it."],
    ["npm install", "Needs Node 18 or newer."],
    [
      "Create a D1 database and paste its id into wrangler.toml",
      "This is where the offline queue lives.",
    ],
    [
      "Apply the migrations, locally first then remote",
      "Creates the schema every endpoint above reads and writes.",
    ],
    ["Set the API_KEY secret", "The value /v1/push will expect in its Bearer header."],
    ["Deploy the Worker", "You get a https://YOUR-DOMAIN.workers.dev endpoint immediately."],
  ];
  return (
    <Section
      id="setup"
      kicker="How to deploy"
      title="Six steps from a clone to a live endpoint"
      lead="No account signups and no external project to create. Every value below is a placeholder; your own database id and API key never go in the repository."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
        <ol className="grid gap-3">
          {steps.map(([t, why], i) => (
            <li
              key={t}
              className="grid grid-cols-[28px_1fr] items-start gap-3 border-b border-border py-3 first:border-t"
            >
              <span className="font-mono text-[13px] text-muted-foreground">{i + 1}</span>
              <span>
                <span className="block font-semibold text-foreground">{t}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-muted-foreground">
                  {why}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div>
          <CodeBlock label="terminal" code={SETUP} />
          <div className="mt-2 grid gap-0 sm:grid-cols-2 sm:gap-6">
            <Gloss
              term="wrangler"
              note="Cloudflare's command-line tool. It is how you create the database, set secrets and publish the Worker."
            />
            <Gloss
              term="secret"
              note="a value stored by Cloudflare and injected at runtime, so it never appears in your code or your repository."
            />
          </div>
        </div>
      </div>
      <NextStep href="#download" action="Get the repository">
        Next: the two links that start all of this.
      </NextStep>
    </Section>
  );
}

function Download() {
  return (
    <Section
      id="download"
      kicker="How to get it"
      title="Take the code"
      lead="Two ways in: browse it on GitHub, or pull the whole default branch as a zip. Nothing is hosted for you, and nothing phones home."
      tone="muted"
    >
      <div className="flex flex-wrap gap-3">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-44 bg-primary text-primary-foreground"
        >
          <GitIcon /> View on GitHub
        </a>
        <a href={ZIP_URL} target="_blank" rel="noreferrer" className="btn-44 border border-border">
          <DownloadIcon /> Download ZIP (main)
        </a>
      </div>
      <p className="mt-5 font-mono text-[13px] break-all text-muted-foreground">{REPO_URL}</p>
      <p className="mt-3 text-[14px] text-muted-foreground">
        The zip is built from the <span className="font-mono text-foreground">main</span> branch,
        which is the repository default.
      </p>
    </Section>
  );
}

function Stack() {
  const why: { t: string; i: TreeIconName; d: string }[] = [
    {
      t: "Cloudflare Workers",
      i: "cloud-add",
      d: "Runs the HTTP API at the edge, close to whoever is being notified.",
    },
    {
      t: "Durable Objects",
      i: "component",
      d: "Gives each user one addressable process that can hold their WebSocket open.",
    },
    {
      t: "Cloudflare D1",
      i: "data",
      d: "Stores devices and pending notifications in the same account.",
    },
    { t: "TypeScript", i: "code", d: "One language from the API through to the client types." },
    {
      t: "Kotlin",
      i: "android",
      d: "The Android sample, so the reconnect behaviour is proven on a real device.",
    },
    { t: "MIT License", i: "verify", d: "Use it commercially, fork it, ship it." },
  ];
  return (
    <Section
      id="stack"
      kicker="Stack and licence"
      title="Five pieces of infrastructure, one licence"
      lead="Everything here is either Cloudflare's own platform or a language runtime. There is no queue service, no push vendor and no database host to pay separately."
    >
      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {why.map((row) => (
          <div key={row.t} className="border-t border-border pt-3">
            <dt className="flex items-center gap-2.5 font-mono text-[15px] font-semibold text-foreground">
              <TreeIcon name={row.i} size={20} motion="static" />
              {row.t}
            </dt>
            <dd className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{row.d}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        MIT licensed, built by FastHand Studio. Bugs and pull requests go to the repository, not to
        an inbox.
      </p>
      <NextStep href="/products" action="Browse all products">
        Next: the other things the studio has published, on the same stack and terms.
      </NextStep>
    </Section>
  );
}
