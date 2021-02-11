// @flow

import * as React from "react";
import { MultiSelectInput } from ".";
import type { OptionType } from "./MultiSelectInput";

type Props = {
  value: string[],
  onChange: (options: OptionType[]) => void,
};

const options: OptionType[] = [
  {
    value: "requests",
    label: "requests",
    description: "Number of requests processed.",
  },
  { value: "hits", label: "hits", description: "Number of cache hits." },
  {
    value: "hits_time",
    label: "hits_time",
    description:
      "Total amount of time spent processing cache hits (in seconds).",
  },
  { value: "miss", label: "miss", description: "Number of cache misses." },
  {
    value: "miss_time",
    label: "miss_time",
    description:
      "Total amount of time spent processing cache misses (in seconds).",
  },
  {
    value: "pass",
    label: "pass",
    description:
      "Number of requests that passed through the CDN without being cached.",
  },
  {
    value: "pass_time",
    label: "pass_time",
    description:
      "Total amount of time spent processing cache passes (in seconds).",
  },
  { value: "errors", label: "errors", description: "Number of cache errors." },
  {
    value: "restarts",
    label: "restarts",
    description: "Number of restarts performed.",
  },
  {
    value: "hit_ratio",
    label: "hit_ratio",
    description: "Ratio of cache hits to cache misses (between 0 and 1).",
  },
  {
    value: "bandwidth",
    label: "bandwidth",
    description:
      "Total bytes delivered (resp_header_bytes + resp_body_bytes + bereq_header_bytes + bereq_body_bytes).",
  },
  {
    value: "body_size",
    label: "body_size",
    description: "Total body bytes delivered (alias for resp_body_bytes).",
  },
  {
    value: "header_size",
    label: "header_size",
    description: "Total header bytes delivered (alias for resp_header_bytes).",
  },
  {
    value: "req_body_bytes",
    label: "req_body_bytes",
    description: "Total body bytes received.",
  },
  {
    value: "req_header_bytes",
    label: "req_header_bytes",
    description: "Total header bytes received.",
  },
  {
    value: "resp_body_bytes",
    label: "resp_body_bytes",
    description:
      "Total body bytes delivered (edge_resp_body_bytes + shield_resp_body_bytes).",
  },
  {
    value: "resp_header_bytes",
    label: "resp_header_bytes",
    description:
      "Total header bytes delivered (edge_resp_header_bytes + shield_resp_header_bytes).",
  },
  {
    value: "bereq_body_bytes",
    label: "bereq_body_bytes",
    description: "Total body bytes sent to origin.",
  },
  {
    value: "bereq_header_bytes",
    label: "bereq_header_bytes",
    description: "Total header bytes sent to origin.",
  },
  {
    value: "uncacheable",
    label: "uncacheable",
    description: "Number of requests that were designated uncachable.",
  },
  {
    value: "pipe",
    label: "pipe",
    description: "Optional. Pipe operations performed (legacy feature).",
  },
  {
    value: "tls",
    label: "tls",
    description: "Number of requests that were received over TLS.",
  },
  {
    value: "tls_v10",
    label: "tls_v10",
    description: "Number of requests received over TLS 1.0.",
  },
  {
    value: "tls_v11",
    label: "tls_v11",
    description: "Number of requests received over TLS 1.1.",
  },
  {
    value: "tls_v12",
    label: "tls_v12",
    description: "Number of requests received over TLS 1.2.",
  },
  {
    value: "tls_v13",
    label: "tls_v13",
    description: "Number of requests received over TLS 1.3.",
  },
  {
    value: "edge_requests",
    label: "edge_requests",
    description: "Number of requests sent by end users to Fastly.",
  },
  {
    value: "edge_resp_header_bytes",
    label: "edge_resp_header_bytes",
    description: "Total header bytes delivered from Fastly to the end user.",
  },
  {
    value: "edge_resp_body_bytes",
    label: "edge_resp_body_bytes",
    description: "Total body bytes delivered from Fastly to the end user.",
  },
  {
    value: "origin_fetches",
    label: "origin_fetches",
    description: "Number of requests sent to origin.",
  },
  {
    value: "origin_fetch_header_bytes",
    label: "origin_fetch_header_bytes",
    description: "Total request header bytes sent to origin.",
  },
  {
    value: "origin_fetch_body_bytes",
    label: "origin_fetch_body_bytes",
    description: "Total request body bytes sent to origin.",
  },
  {
    value: "origin_fetch_resp_header_bytes",
    label: "origin_fetch_resp_header_bytes",
    description: "Total header bytes received from origin.",
  },
  {
    value: "origin_fetch_resp_body_bytes",
    label: "origin_fetch_resp_body_bytes",
    description: "Total body bytes received from origin.",
  },
  {
    value: "origin_revalidations",
    label: "origin_revalidations",
    description:
      "Number of responses received from origin with a 304 status code in response to an If-Modified-Since or If-None-Match request. Under regular scenarios, a revalidation will imply a cache hit. However, if using Fastly Image Optimizer or segmented caching this may result in a cache miss.",
  },
  {
    value: "shield",
    label: "shield",
    description: "Number of requests from edge to the shield POP.",
  },
  {
    value: "shield_resp_body_bytes",
    label: "shield_resp_body_bytes",
    description: "Total body bytes delivered via a shield.",
  },
  {
    value: "shield_resp_header_bytes",
    label: "shield_resp_header_bytes",
    description: "Total header bytes delivered via a shield.",
  },
  {
    value: "shield_fetches",
    label: "shield_fetches",
    description:
      "Number of requests made from one Fastly data center to another, as part of shielding.",
  },
  {
    value: "shield_fetch_header_bytes",
    label: "shield_fetch_header_bytes",
    description: "Total request header bytes sent to a shield.",
  },
  {
    value: "shield_fetch_body_bytes",
    label: "shield_fetch_body_bytes",
    description: "Total request body bytes sent to a shield.",
  },
  {
    value: "shield_fetch_resp_header_bytes",
    label: "shield_fetch_resp_header_bytes",
    description: "Total response header bytes sent from a shield to the edge.",
  },
  {
    value: "shield_fetch_resp_body_bytes",
    label: "shield_fetch_resp_body_bytes",
    description: "Total response body bytes sent from a shield to the edge.",
  },
  {
    value: "shield_revalidations",
    label: "shield_revalidations",
    description:
      "Number of responses received from origin with a 304 status code, in response to an If-Modified-Since or If-None-Match request to a shield. Under regular scenarios, a revalidation will imply a cache hit. However, if using segmented caching this may result in a cache miss.",
  },
  {
    value: "ipv6",
    label: "ipv6",
    description: "Number of requests that were received over IPv6.",
  },
  {
    value: "otfp",
    label: "otfp",
    description:
      "Number of responses that came from the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand.",
  },
  {
    value: "otfp_resp_body_bytes",
    label: "otfp_resp_body_bytes",
    description:
      "Total body bytes delivered from the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand.",
  },
  {
    value: "otfp_resp_header_bytes",
    label: "otfp_resp_header_bytes",
    description:
      "Total header bytes delivered from the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand.",
  },
  {
    value: "otfp_shield_resp_body_bytes",
    label: "otfp_shield_resp_body_bytes",
    description:
      "Total body bytes delivered via a shield for the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand.",
  },
  {
    value: "otfp_shield_resp_header_bytes",
    label: "otfp_shield_resp_header_bytes",
    description:
      "Total header bytes delivered via a shield for the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand.",
  },
  {
    value: "otfp_manifests",
    label: "otfp_manifests",
    description:
      "Number of responses that were manifest files from the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand.",
  },
  {
    value: "otfp_deliver_time",
    label: "otfp_deliver_time",
    description:
      "Total amount of time spent delivering a response from the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand (in seconds).",
  },
  {
    value: "otfp_shield_time",
    label: "otfp_shield_time",
    description:
      "Total amount of time spent delivering a response via a shield from the Fastly On-the-Fly Packager for On Demand Streaming service for video-on-demand (in seconds).",
  },
  {
    value: "video",
    label: "video",
    description:
      "Number of responses with the video segment or video manifest MIME type (i.e., application/x-mpegurl, application/vnd.apple.mpegurl, application/f4m, application/dash+xml, application/vnd.ms-sstr+xml, ideo/mp2t, audio/aac, video/f4f, video/x-flv, video/mp4, audio/mp4).",
  },
  {
    value: "pci",
    label: "pci",
    description: "Number of responses with the PCI flag turned on.",
  },
  { value: "log", label: "log", description: "Number of log lines sent." },
  {
    value: "log_bytes",
    label: "log_bytes",
    description: "Total log bytes sent.",
  },
  {
    value: "http2",
    label: "http2",
    description: "Number of requests received over HTTP2.",
  },
  {
    value: "waf_logged",
    label: "waf_logged",
    description:
      "Number of requests that triggered a WAF rule and were logged.",
  },
  {
    value: "waf_blocked",
    label: "waf_blocked",
    description:
      "Number of requests that triggered a WAF rule and were blocked.",
  },
  {
    value: "waf_passed",
    label: "waf_passed",
    description:
      "Number of requests that triggered a WAF rule and were passed.",
  },
  {
    value: "attack_req_body_bytes",
    label: "attack_req_body_bytes",
    description:
      "Total body bytes received from requests that triggered a WAF rule.",
  },
  {
    value: "attack_req_header_bytes",
    label: "attack_req_header_bytes",
    description:
      "Total header bytes received from requests that triggered a WAF rule.",
  },
  {
    value: "attack_logged_req_body_bytes",
    label: "attack_logged_req_body_bytes",
    description:
      "Total body bytes received from requests that triggered a WAF rule that was logged.",
  },
  {
    value: "attack_logged_req_header_bytes",
    label: "attack_logged_req_header_bytes",
    description:
      "Total header bytes received from requests that triggered a WAF rule that was logged.",
  },
  {
    value: "attack_blocked_req_body_bytes",
    label: "attack_blocked_req_body_bytes",
    description:
      "Total body bytes received from requests that triggered a WAF rule that was blocked.",
  },
  {
    value: "attack_blocked_req_header_bytes",
    label: "attack_blocked_req_header_bytes",
    description:
      "Total header bytes received from requests that triggered a WAF rule that was blocked.",
  },
  {
    value: "attack_passed_req_body_bytes",
    label: "attack_passed_req_body_bytes",
    description:
      "Total body bytes received from requests that triggered a WAF rule that was passed.",
  },
  {
    value: "attack_passed_req_header_bytes",
    label: "attack_passed_req_header_bytes",
    description:
      "Total header bytes received from requests that triggered a WAF rule that was passed.",
  },
  {
    value: "attack_resp_synth_bytes",
    label: "attack_resp_synth_bytes",
    description:
      "Total bytes delivered for requests that triggered a WAF rule and returned a synthetic response.",
  },
  {
    value: "imgopto",
    label: "imgopto",
    description:
      "Number of responses that came from the Fastly Image Optimizer service.",
  },
  {
    value: "imgopto_resp_body_bytes",
    label: "imgopto_resp_body_bytes",
    description:
      "Total body bytes delivered from the Fastly Image Optimizer service.",
  },
  {
    value: "imgopto_resp_header_bytes",
    label: "imgopto_resp_header_bytes",
    description:
      "Total header bytes delivered from the Fastly Image Optimizer service.",
  },
  {
    value: "imgopto_shield_resp_body_bytes",
    label: "imgopto_shield_resp_body_bytes",
    description:
      "Total body bytes delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgopto_shield_resp_header_bytes",
    label: "imgopto_shield_resp_header_bytes",
    description:
      "Total header bytes delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo",
    label: "imgvideo",
    description:
      "Number of video responses that came from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_frames",
    label: "imgvideo_frames",
    description:
      "Number of video frames that came from the Fastly Image Optimizer service. A video frame is an individual image within a sequence of video.",
  },
  {
    value: "imgvideo_resp_header_bytes",
    label: "imgvideo_resp_header_bytes",
    description:
      "Total header bytes of video delivered from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_resp_body_bytes",
    label: "imgvideo_resp_body_bytes",
    description:
      "Total body bytes of video delivered from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield_resp_header_bytes",
    label: "imgvideo_shield_resp_header_bytes",
    description:
      "Total header bytes of video delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield_resp_body_bytes",
    label: "imgvideo_shield_resp_body_bytes",
    description:
      "Total body bytes of video delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield",
    label: "imgvideo_shield",
    description:
      "Number of video responses delivered via a shield that came from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield_frames",
    label: "imgvideo_shield_frames",
    description:
      "Number of video frames delivered via a shield that came from the Fastly Image Optimizer service. A video frame is an individual image within a sequence of video.",
  },
  {
    value: "status_200",
    label: "status_200",
    description: "Number of responses sent with status code 200 (Success).",
  },
  {
    value: "status_204",
    label: "status_204",
    description: "Number of responses sent with status code 204 (No Content).",
  },
  {
    value: "status_206",
    label: "status_206",
    description:
      "Number of responses sent with status code 206 (Partial Content).",
  },
  {
    value: "status_301",
    label: "status_301",
    description:
      "Number of responses sent with status code 301 (Moved Permanently).",
  },
  {
    value: "status_302",
    label: "status_302",
    description: "Number of responses sent with status code 302 (Found).",
  },
  {
    value: "status_304",
    label: "status_304",
    description:
      "Number of responses sent with status code 304 (Not Modified).",
  },
  {
    value: "status_400",
    label: "status_400",
    description: "Number of responses sent with status code 400 (Bad Request).",
  },
  {
    value: "status_401",
    label: "status_401",
    description:
      "Number of responses sent with status code 401 (Unauthorized).",
  },
  {
    value: "status_403",
    label: "status_403",
    description: "Number of responses sent with status code 403 (Forbidden).",
  },
  {
    value: "status_404",
    label: "status_404",
    description: "Number of responses sent with status code 404 (Not Found).",
  },
  {
    value: "status_416",
    label: "status_416",
    description:
      "Number of responses sent with status code 416 (Range Not Satisfiable).",
  },
  {
    value: "status_429",
    label: "status_429",
    description:
      "Number of responses sent with status code 429 (Too Many Requests).",
  },
  {
    value: "status_500",
    label: "status_500",
    description:
      "Number of responses sent with status code 500 (Internal Server Error).",
  },
  {
    value: "status_501",
    label: "status_501",
    description:
      "Number of responses sent with status code 501 (Not Implemented).",
  },
  {
    value: "status_502",
    label: "status_502",
    description: "Number of responses sent with status code 502 (Bad Gateway).",
  },
  {
    value: "status_503",
    label: "status_503",
    description:
      "Number of responses sent with status code 503 (Service Unavailable).",
  },
  {
    value: "status_504",
    label: "status_504",
    description:
      "Number of responses sent with status code 504 (Gateway Timeout).",
  },
  {
    value: "status_505",
    label: "status_505",
    description:
      "Number of responses sent with status code 505 (HTTP Version Not Supported).",
  },
  {
    value: "status_1xx",
    label: "status_1xx",
    description: "Number of 'Informational' category status codes delivered.",
  },
  {
    value: "status_2xx",
    label: "status_2xx",
    description: "Number of 'Success' status codes delivered.",
  },
  {
    value: "status_3xx",
    label: "status_3xx",
    description: "Number of 'Redirection' codes delivered.",
  },
  {
    value: "status_4xx",
    label: "status_4xx",
    description: "Number of 'Client Error' codes delivered.",
  },
  {
    value: "status_5xx",
    label: "status_5xx",
    description: "Number of 'Server Error' codes delivered.",
  },
  {
    value: "object_size_1k",
    label: "object_size_1k",
    description: "Number of objects served that were under 1KB in size.",
  },
  {
    value: "object_size_10k",
    label: "object_size_10k",
    description:
      "Number of objects served that were between 1KB and 10KB in size.",
  },
  {
    value: "object_size_100k",
    label: "object_size_100k",
    description:
      "Number of objects served that were between 10KB and 100KB in size.",
  },
  {
    value: "object_size_1m",
    label: "object_size_1m",
    description:
      "Number of objects served that were between 100KB and 1MB in size.",
  },
  {
    value: "object_size_10m",
    label: "object_size_10m",
    description:
      "Number of objects served that were between 1MB and 10MB in size.",
  },
  {
    value: "object_size_100m",
    label: "object_size_100m",
    description:
      "Number of objects served that were between 10MB and 100MB in size.",
  },
  {
    value: "object_size_1g",
    label: "object_size_1g",
    description:
      "Number of objects served that were between 100MB and 1GB in size.",
  },
  {
    value: "recv_sub_time",
    label: "recv_sub_time",
    description:
      "Time spent inside the 'recv' Varnish subroutine (in seconds).",
  },
  {
    value: "recv_sub_count",
    label: "recv_sub_count",
    description: "Number of executions of the 'recv' Varnish subroutine.",
  },
  {
    value: "hash_sub_time",
    label: "hash_sub_time",
    description:
      "Time spent inside the 'hash' Varnish subroutine (in seconds).",
  },
  {
    value: "hash_sub_count",
    label: "hash_sub_count",
    description: "Number of executions of the 'hash' Varnish subroutine.",
  },
  {
    value: "miss_sub_time",
    label: "miss_sub_time",
    description:
      "Time spent inside the 'miss' Varnish subroutine (in seconds).",
  },
  {
    value: "miss_sub_count",
    label: "miss_sub_count",
    description: "Number of executions of the 'miss' Varnish subroutine.",
  },
  {
    value: "fetch_sub_time",
    label: "fetch_sub_time",
    description:
      "Time spent inside the 'fetch' Varnish subroutine (in seconds).",
  },
  {
    value: "fetch_sub_count",
    label: "fetch_sub_count",
    description: "Number of executions of the 'fetch' Varnish subroutine.",
  },
  {
    value: "pass_sub_time",
    label: "pass_sub_time",
    description:
      "Time spent inside the 'pass' Varnish subroutine (in seconds).",
  },
  {
    value: "pass_sub_count",
    label: "pass_sub_count",
    description: "Number of executions of the 'pass' Varnish subroutine.",
  },
  {
    value: "pipe_sub_time",
    label: "pipe_sub_time",
    description:
      "Time spent inside the 'pipe' Varnish subroutine (in seconds).",
  },
  {
    value: "pipe_sub_count",
    label: "pipe_sub_count",
    description: "Number of executions of the 'pipe' Varnish subroutine.",
  },
  {
    value: "deliver_sub_time",
    label: "deliver_sub_time",
    description:
      "Time spent inside the 'deliver' Varnish subroutine (in seconds).",
  },
  {
    value: "deliver_sub_count",
    label: "deliver_sub_count",
    description: "Number of executions of the 'deliver' Varnish subroutine.",
  },
  {
    value: "error_sub_time",
    label: "error_sub_time",
    description:
      "Time spent inside the 'error' Varnish subroutine (in seconds).",
  },
  {
    value: "error_sub_count",
    label: "error_sub_count",
    description: "Number of executions of the 'error' Varnish subroutine.",
  },
  {
    value: "hit_sub_time",
    label: "hit_sub_time",
    description: "Time spent inside the 'hit' Varnish subroutine (in seconds).",
  },
  {
    value: "hit_sub_count",
    label: "hit_sub_count",
    description: "Number of executions of the 'hit' Varnish subroutine.",
  },
  {
    value: "prehash_sub_time",
    label: "prehash_sub_time",
    description:
      "Time spent inside the 'prehash' Varnish subroutine (in seconds).",
  },
  {
    value: "prehash_sub_count",
    label: "prehash_sub_count",
    description: "Number of executions of the 'prehash' Varnish subroutine.",
  },
  {
    value: "predeliver_sub_time",
    label: "predeliver_sub_time",
    description:
      "Time spent inside the 'predeliver' Varnish subroutine (in seconds).",
  },
  {
    value: "predeliver_sub_count",
    label: "predeliver_sub_count",
    description: "Number of executions of the 'predeliver' Varnish subroutine.",
  },
  {
    value: "tls_handshake_bytes",
    label: "tls_handshake_bytes",
    description: "Number of bytes transferred during TLS handshake.",
  },
  {
    value: "hit_resp_body_bytes",
    label: "hit_resp_body_bytes",
    description: "Total body bytes delivered for cache hits.",
  },
  {
    value: "miss_resp_body_bytes",
    label: "miss_resp_body_bytes",
    description: "Total body bytes delivered for cache misses.",
  },
  {
    value: "pass_resp_body_bytes",
    label: "pass_resp_body_bytes",
    description: "Total body bytes delivered for cache passes.",
  },
  {
    value: "segblock_origin_fetches",
    label: "segblock_origin_fetches",
    description:
      "Number of Range requests to origin for segments of resources when using segmented caching.",
  },
  {
    value: "segblock_shield_fetches",
    label: "segblock_shield_fetches",
    description:
      "Number of Range requests to a shield for segments of resources when using segmented caching.",
  },
  {
    value: "compute_requests",
    label: "compute_requests",
    description:
      "The total number of requests that were received for your site by Fastly.",
  },
  {
    value: "compute_request_time_ms",
    label: "compute_request_time_ms",
    description:
      "The amount of active CPU time used to process your requests (in milliseconds).",
  },
  {
    value: "compute_ram_used",
    label: "compute_ram_used",
    description:
      "The amount of RAM used for your site by Fastly, including a maximum indicating the highest usage within this timeframe and a static cap for usage.",
  },
  {
    value: "compute_execution_time_ms",
    label: "compute_execution_time_ms",
    description:
      "The total, actual amount of time used to process your requests, including active CPU time (in milliseconds).",
  },
];

const FastlyMetricSelect = (props: Props): React.Node => {
  const { value, onChange } = props;

  return (
    <MultiSelectInput value={value} options={options} onChange={onChange} />
  );
};

export default FastlyMetricSelect;
