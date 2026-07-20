"use client";
import { useState } from "react";

const STATUS_CODES: { code: number; name: string; description: string }[] = [
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so." },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet." },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message." },
  { code: 200, name: "OK", description: "The request has succeeded. The meaning of success depends on the HTTP method." },
  { code: 201, name: "Created", description: "The request has succeeded and a new resource has been created as a result." },
  { code: 202, name: "Accepted", description: "The request has been received but not yet acted upon." },
  { code: 203, name: "Non-Authoritative Information", description: "The returned metadata is not exactly the same as is available from the origin server." },
  { code: 204, name: "No Content", description: "There is no content to send for this request, but the headers may be useful." },
  { code: 205, name: "Reset Content", description: "Tells the user agent to reset the document which sent this request." },
  { code: 206, name: "Partial Content", description: "This response code is used when the Range header is sent from the client to request only part of a resource." },
  { code: 207, name: "Multi-Status", description: "Conveys information about multiple resources, for situations where multiple status codes might be appropriate." },
  { code: 208, name: "Already Reported", description: "Used inside a DAV: propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly." },
  { code: 226, name: "IM Used", description: "The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance." },
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response. The user agent or user should choose one of them." },
  { code: 301, name: "Moved Permanently", description: "The URL of the requested resource has been changed permanently. The new URL is given in the response." },
  { code: 302, name: "Found", description: "This response code means that the URI of requested resource has been changed temporarily." },
  { code: 303, name: "See Other", description: "The server sent this response to direct the client to get the requested resource at another URI with a GET request." },
  { code: 304, name: "Not Modified", description: "This is used for caching purposes. It tells the client that the response has not been modified." },
  { code: 305, name: "Use Proxy", description: "Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy." },
  { code: 307, name: "Temporary Redirect", description: "The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request." },
  { code: 308, name: "Permanent Redirect", description: "This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header." },
  { code: 400, name: "Bad Request", description: "The server could not understand the request due to invalid syntax." },
  { code: 401, name: "Unauthorized", description: "Although the HTTP standard specifies 'unauthorized', semantically this response means 'unauthenticated'." },
  { code: 402, name: "Payment Required", description: "This response code is reserved for future use. The initial aim was for digital payment systems." },
  { code: 403, name: "Forbidden", description: "The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource." },
  { code: 404, name: "Not Found", description: "The server can not find the requested resource. In the browser, this means the URL is not recognized." },
  { code: 405, name: "Method Not Allowed", description: "The request method is known by the server but is not supported by the target resource." },
  { code: 406, name: "Not Acceptable", description: "This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent." },
  { code: 407, name: "Proxy Authentication Required", description: "This is similar to 401 but authentication is needed to be done by a proxy." },
  { code: 408, name: "Request Timeout", description: "This response is sent on an idle connection by some servers, even without any previous request by the client." },
  { code: 409, name: "Conflict", description: "This response is sent when a request conflicts with the current state of the server." },
  { code: 410, name: "Gone", description: "This response is sent when the requested content has been permanently deleted from server, with no forwarding address." },
  { code: 411, name: "Length Required", description: "Server rejected the request because the Content-Length header field is not defined and the server requires it." },
  { code: 412, name: "Precondition Failed", description: "The client has indicated preconditions in its headers which the server does not meet." },
  { code: 413, name: "Content Too Large", description: "Request entity is larger than limits defined by server." },
  { code: 414, name: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret." },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server." },
  { code: 416, name: "Range Not Satisfiable", description: "The range specified by the Range header field in the request can't be fulfilled." },
  { code: 417, name: "Expectation Failed", description: "This response code means the expectation indicated by the Expect request header field can't be met by the server." },
  { code: 418, name: "I'm a teapot", description: "The server refuses the attempt to brew coffee with a teapot. (April Fools' joke RFC 2324)" },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response." },
  { code: 422, name: "Unprocessable Content", description: "The request was well-formed but was unable to be followed due to semantic errors." },
  { code: 423, name: "Locked", description: "The resource that is being accessed is locked." },
  { code: 424, name: "Failed Dependency", description: "The request failed due to failure of a previous request." },
  { code: 425, name: "Too Early", description: "Indicates that the server is unwilling to risk processing a request that might be replayed." },
  { code: 426, name: "Upgrade Required", description: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol." },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional." },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time ('rate limiting')." },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The user agent requested a resource that cannot legally be provided, such as a web page censored by a government." },
  { code: 500, name: "Internal Server Error", description: "The server has encountered a situation it doesn't know how to handle." },
  { code: 501, name: "Not Implemented", description: "The request method is not supported by the server and cannot be handled." },
  { code: 502, name: "Bad Gateway", description: "This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response." },
  { code: 503, name: "Service Unavailable", description: "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded." },
  { code: 504, name: "Gateway Timeout", description: "This error response is given when the server is acting as a gateway and cannot get a response in time." },
  { code: 505, name: "HTTP Version Not Supported", description: "The HTTP version used in the request is not supported by the server." },
  { code: 506, name: "Variant Also Negotiates", description: "The server has an internal configuration error." },
  { code: 507, name: "Insufficient Storage", description: "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request." },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request." },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfil it." },
  { code: 511, name: "Network Authentication Required", description: "Indicates that the client needs to authenticate to gain network access." },
];

const CATEGORY_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  2: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  3: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  4: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  5: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function HttpStatusCodes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<number | null>(null);

  const filtered = STATUS_CODES.filter(s => {
    const matchSearch = !search || s.code.toString().includes(search) || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === null || Math.floor(s.code / 100) === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          className="flex-1 min-w-[200px] text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
          placeholder="Search by code, name, or description…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {[null, 1, 2, 3, 4, 5].map(f => (
            <button
              key={f ?? "all"}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filter === f ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}
            >
              {f === null ? "All" : `${f}xx`}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map(s => {
          const cat = Math.floor(s.code / 100);
          return (
            <div key={s.code} className="flex gap-3 items-start p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <span className={`shrink-0 text-sm font-bold font-mono px-2 py-0.5 rounded-md ${CATEGORY_COLORS[cat]}`}>{s.code}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{s.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.description}</p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-[var(--text-muted)] text-center py-8">No status codes match your search.</p>}
      </div>
    </div>
  );
}
