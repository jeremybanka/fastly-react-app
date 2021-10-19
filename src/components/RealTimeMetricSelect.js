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
    value: "attack_blocked_req_body_bytes",
    label: "attack_blocked_req_body_bytes", 
    description: "Total body bytes received from requests that triggered a WAF rule that was blocked.",
  },
  {
    value: "attack_blocked_req_header_bytes",
    label: "attack_blocked_req_header_bytes", 
    description: "Total header bytes received from requests that triggered a WAF rule that was blocked.",
  },
  {
    value: "attack_logged_req_body_bytes",
    label: "attack_logged_req_body_bytes", 
    description: "Total body bytes received from requests that triggered a WAF rule that was logged.",
  },
  {
    value: "attack_logged_req_header_bytes",
    label: "attack_logged_req_header_bytes", 
    description: "Total header bytes received from requests that triggered a WAF rule that was logged.",
  },
  {
    value: "attack_passed_req_body_bytes",
    label: "attack_passed_req_body_bytes", 
    description: "Total body bytes received from requests that triggered a WAF rule that was passed.",
  },
  {
    value: "attack_passed_req_header_bytes",
    label: "attack_passed_req_header_bytes", 
    description: "Total header bytes received from requests that triggered a WAF rule that was passed.",
  },
  {
    value: "attack_req_body_bytes",
    label: "attack_req_body_bytes", 
    description: "Total body bytes received from requests that triggered a WAF rule.",
  },
  {
    value: "attack_req_header_bytes",
    label: "attack_req_header_bytes", 
    description: "Total header bytes received from requests that triggered a WAF rule.",
  },
  {
    value: "attack_resp_synth_bytes",
    label: "attack_resp_synth_bytes", 
    description: "Total bytes delivered for requests that triggered a WAF rule and returned a synthetic response.",
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
    value: "body_size",
    label: "body_size", 
    description: "Total body bytes delivered (alias for resp_body_bytes).",
  },
  {
    value: "compute_bereq_body_bytes",
    label: "compute_bereq_body_bytes", 
    description: "Total body bytes sent to backends (origins) by Compute@Edge.",
  },
  {
    value: "compute_bereq_errors",
    label: "compute_bereq_errors", 
    description: "Number of backend request errors, including timeouts.",
  },
  {
    value: "compute_bereq_header_bytes",
    label: "compute_bereq_header_bytes", 
    description: "Total header bytes sent to backends (origins) by Compute@Edge.",
  },
  {
    value: "compute_bereqs",
    label: "compute_bereqs", 
    description: "Number of backend requests started.",
  },
  {
    value: "compute_beresp_body_bytes",
    label: "compute_beresp_body_bytes", 
    description: "Total body bytes received from backends (origins) by Compute@Edge.",
  },
  {
    value: "compute_beresp_header_bytes",
    label: "compute_beresp_header_bytes", 
    description: "Total header bytes received from backends (origins) by Compute@Edge.",
  },
  {
    value: "compute_execution_time_ms",
    label: "compute_execution_time_ms", 
    description: "The amount of active CPU time used to process your requests (in milliseconds).",
  },
  {
    value: "compute_globals_limit_exceeded",
    label: "compute_globals_limit_exceeded", 
    description: "Number of times a guest exceeded its globals limit.",
  },
  {
    value: "compute_guest_errors",
    label: "compute_guest_errors", 
    description: "Number of times a service experienced a guest code error.",
  },
  {
    value: "compute_heap_limit_exceeded",
    label: "compute_heap_limit_exceeded", 
    description: "Number of times a guest exceeded its heap limit.",
  },
  {
    value: "compute_ram_used",
    label: "compute_ram_used", 
    description: "The amount of RAM used for your site by Fastly, including a maximum indicating the highest usage within this timeframe and a static cap for usage.",
  },
  {
    value: "compute_req_body_bytes",
    label: "compute_req_body_bytes", 
    description: "Total body bytes received by Compute@Edge.",
  },
  {
    value: "compute_req_header_bytes",
    label: "compute_req_header_bytes", 
    description: "Total header bytes received by Compute@Edge.",
  },
  {
    value: "compute_request_time_ms",
    label: "compute_request_time_ms", 
    description: "The total, actual amount of time used to process your requests, including active CPU time (in milliseconds).",
  },
  {
    value: "compute_requests",
    label: "compute_requests", 
    description: "The total number of requests that were received for your site by Fastly.",
  },
  {
    value: "compute_resource_limit_exceeded",
    label: "compute_resource_limit_exceeded", 
    description: "Number of times a guest exceeded its resource limit, includes heap, stack, globals, and code execution timeout.",
  },
  {
    value: "compute_resp_body_bytes",
    label: "compute_resp_body_bytes", 
    description: "Total body bytes sent from Compute@Edge to end user.",
  },
  {
    value: "compute_resp_header_bytes",
    label: "compute_resp_header_bytes", 
    description: "Total header bytes sent from Compute@Edge to end user.",
  },
  {
    value: "compute_resp_status_1xx",
    label: "compute_resp_status_1xx", 
    description: "Number of \"Informational\" category status codes delivered by Compute@Edge.",
  },
  {
    value: "compute_resp_status_2xx",
    label: "compute_resp_status_2xx", 
    description: "Number of \"Success\" category status codes delivered by Compute@Edge.",
  },
  {
    value: "compute_resp_status_3xx",
    label: "compute_resp_status_3xx", 
    description: "Number of \"Redirection\" category status codes delivered by Compute@Edge.",
  },
  {
    value: "compute_resp_status_4xx",
    label: "compute_resp_status_4xx", 
    description: "Number of \"Client Error\" category status codes delivered by Compute@Edge.",
  },
  {
    value: "compute_resp_status_5xx",
    label: "compute_resp_status_5xx", 
    description: "Number of \"Server Error\" category status codes delivered by Compute@Edge.",
  },
  {
    value: "compute_runtime_errors",
    label: "compute_runtime_errors", 
    description: "Number of times a service experienced a guest runtime error.",
  },
  {
    value: "compute_stack_limit_exceeded",
    label: "compute_stack_limit_exceeded", 
    description: "Number of times a guest exceeded its stack limit.",
  },
  {
    value: "deliver_sub_count",
    label: "deliver_sub_count", 
    description: "Number of executions of the vcl_deliver Varnish subroutine.",
  },
  {
    value: "deliver_sub_time",
    label: "deliver_sub_time", 
    description: "Time spent inside the vcl_deliver Varnish subroutine (in nanoseconds).",
  },
  {
    value: "edge_hit_requests",
    label: "edge_hit_requests", 
    description: "Number of requests sent by end users to Fastly that resulted in a hit at the edge.",
  },
  {
    value: "edge_miss_requests",
    label: "edge_miss_requests", 
    description: "Number of requests sent by end users to Fastly that resulted in a miss at the edge.",
  },
  {
    value: "edge_requests",
    label: "edge_requests", 
    description: "Number of requests sent by end users to Fastly.",
  },
  {
    value: "edge_resp_body_bytes",
    label: "edge_resp_body_bytes", 
    description: "Total body bytes delivered from Fastly to the end user.",
  },
  {
    value: "edge_resp_header_bytes",
    label: "edge_resp_header_bytes", 
    description: "Total header bytes delivered from Fastly to the end user.",
  },
  {
    value: "error_sub_count",
    label: "error_sub_count", 
    description: "Number of executions of the vcl_error Varnish subroutine.",
  },
  {
    value: "error_sub_time",
    label: "error_sub_time", 
    description: "Time spent inside the vcl_error Varnish subroutine (in nanoseconds).",
  },
  {
    value: "errors",
    label: "errors", 
    description: "Number of cache errors.",
  },
  {
    value: "fetch_sub_count",
    label: "fetch_sub_count", 
    description: "Number of executions of the vcl_fetch Varnish subroutine.",
  },
  {
    value: "fetch_sub_time",
    label: "fetch_sub_time", 
    description: "Time spent inside the vcl_fetch Varnish subroutine (in nanoseconds).",
  },
  {
    value: "hash_sub_count",
    label: "hash_sub_count", 
    description: "Number of executions of the vcl_hash Varnish subroutine.",
  },
  {
    value: "hash_sub_time",
    label: "hash_sub_time", 
    description: "Time spent inside the vcl_hash Varnish subroutine (in nanoseconds).",
  },
  {
    value: "header_size",
    label: "header_size", 
    description: "Total header bytes delivered (alias for resp_header_bytes).",
  },
  {
    value: "hit_resp_body_bytes",
    label: "hit_resp_body_bytes", 
    description: "Total body bytes delivered for cache hits.",
  },
  {
    value: "hit_sub_count",
    label: "hit_sub_count", 
    description: "Number of executions of the vcl_hit Varnish subroutine.",
  },
  {
    value: "hit_sub_time",
    label: "hit_sub_time", 
    description: "Time spent inside the vcl_hit Varnish subroutine (in nanoseconds).",
  },
  {
    value: "hits",
    label: "hits", 
    description: "Number of cache hits.",
  },
  {
    value: "hits_time",
    label: "hits_time", 
    description: "Total amount of time spent processing cache hits (in seconds).",
  },
  {
    value: "http2",
    label: "http2", 
    description: "Number of requests received over HTTP/2.",
  },
  {
    value: "http3",
    label: "http3", 
    description: "Number of requests received over HTTP/3.",
  },
  {
    value: "imgopto",
    label: "imgopto", 
    description: "Number of responses that came from the Fastly Image Optimizer service. If the service receives 10 requests for an image, this stat will be 10 regardless of how many times the image was transformed.",
  },
  {
    value: "imgopto_resp_body_bytes",
    label: "imgopto_resp_body_bytes", 
    description: "Total body bytes delivered from the Fastly Image Optimizer service, including shield traffic.",
  },
  {
    value: "imgopto_resp_header_bytes",
    label: "imgopto_resp_header_bytes", 
    description: "Total header bytes delivered from the Fastly Image Optimizer service, including shield traffic.",
  },
  {
    value: "imgopto_shield",
    label: "imgopto_shield", 
    description: "Number of responses that came from the Fastly Image Optimizer service via a shield.",
  },
  {
    value: "imgopto_shield_resp_body_bytes",
    label: "imgopto_shield_resp_body_bytes", 
    description: "Total body bytes delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgopto_shield_resp_header_bytes",
    label: "imgopto_shield_resp_header_bytes", 
    description: "Total header bytes delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgopto_transforms",
    label: "imgopto_transforms", 
    description: "Number of transforms performed by the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo",
    label: "imgvideo", 
    description: "Number of video responses that came from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_frames",
    label: "imgvideo_frames", 
    description: "Number of video frames that came from the Fastly Image Optimizer service. A video frame is an individual image within a sequence of video.",
  },
  {
    value: "imgvideo_resp_body_bytes",
    label: "imgvideo_resp_body_bytes", 
    description: "Total body bytes of video delivered from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_resp_header_bytes",
    label: "imgvideo_resp_header_bytes", 
    description: "Total header bytes of video delivered from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield",
    label: "imgvideo_shield", 
    description: "Number of video responses delivered via a shield that came from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield_frames",
    label: "imgvideo_shield_frames", 
    description: "Number of video frames delivered via a shield that came from the Fastly Image Optimizer service. A video frame is an individual image within a sequence of video.",
  },
  {
    value: "imgvideo_shield_resp_body_bytes",
    label: "imgvideo_shield_resp_body_bytes", 
    description: "Total body bytes of video delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "imgvideo_shield_resp_header_bytes",
    label: "imgvideo_shield_resp_header_bytes", 
    description: "Total header bytes of video delivered via a shield from the Fastly Image Optimizer service.",
  },
  {
    value: "ipv6",
    label: "ipv6", 
    description: "Number of requests that were received over IPv6.",
  },
  {
    value: "log",
    label: "log", 
    description: "Number of log lines sent.",
  },
  {
    value: "log_bytes",
    label: "log_bytes", 
    description: "Total log bytes sent.",
  },
  {
    value: "logging",
    label: "logging", 
    description: "Number of log lines sent (alias for log).",
  },
  {
    value: "miss",
    label: "miss", 
    description: "Number of cache misses.",
  },
  {
    value: "miss_resp_body_bytes",
    label: "miss_resp_body_bytes", 
    description: "Total body bytes delivered for cache misses.",
  },
  {
    value: "miss_sub_count",
    label: "miss_sub_count", 
    description: "Number of executions of the vcl_miss Varnish subroutine.",
  },
  {
    value: "miss_sub_time",
    label: "miss_sub_time", 
    description: "Time spent inside the vcl_miss Varnish subroutine (in nanoseconds).",
  },
  {
    value: "miss_time",
    label: "miss_time", 
    description: "Total amount of time spent processing cache misses (in seconds).",
  },
  {
    value: "object_size_100k",
    label: "object_size_100k", 
    description: "Number of objects served that were between 10KB and 100KB in size.",
  },
  {
    value: "object_size_100m",
    label: "object_size_100m", 
    description: "Number of objects served that were between 10MB and 100MB in size.",
  },
  {
    value: "object_size_10k",
    label: "object_size_10k", 
    description: "Number of objects served that were between 1KB and 10KB in size.",
  },
  {
    value: "object_size_10m",
    label: "object_size_10m", 
    description: "Number of objects served that were between 1MB and 10MB in size.",
  },
  {
    value: "object_size_1g",
    label: "object_size_1g", 
    description: "Number of objects served that were between 100MB and 1GB in size.",
  },
  {
    value: "object_size_1k",
    label: "object_size_1k", 
    description: "Number of objects served that were under 1KB in size.",
  },
  {
    value: "object_size_1m",
    label: "object_size_1m", 
    description: "Number of objects served that were between 100KB and 1MB in size.",
  },
  {
    value: "object_size_other",
    label: "object_size_other", 
    description: "Number of objects served that were larger than 1GB in size.",
  },
  {
    value: "origin_cache_fetches",
    label: "origin_cache_fetches", 
    description: "The total number of completed requests made to backends (origins) that returned cacheable content.",
  },
  {
    value: "origin_fetch_body_bytes",
    label: "origin_fetch_body_bytes", 
    description: "Total request body bytes sent to origin.",
  },
  {
    value: "origin_fetch_header_bytes",
    label: "origin_fetch_header_bytes", 
    description: "Total request header bytes sent to origin.",
  },
  {
    value: "origin_fetch_resp_body_bytes",
    label: "origin_fetch_resp_body_bytes", 
    description: "Total body bytes received from origin.",
  },
  {
    value: "origin_fetch_resp_header_bytes",
    label: "origin_fetch_resp_header_bytes", 
    description: "Total header bytes received from origin.",
  },
  {
    value: "origin_fetches",
    label: "origin_fetches", 
    description: "Number of requests sent to origin.",
  },
  {
    value: "origin_revalidations",
    label: "origin_revalidations", 
    description: "Number of responses received from origin with a 304 status code in response to an If-Modified-Since or If-None-Match request. Under regular scenarios, a revalidation will imply a cache hit. However, if using Fastly Image Optimizer or segmented caching this may result in a cache miss.",
  },
  {
    value: "otfp",
    label: "otfp", 
    description: "Number of responses that came from the Fastly On-the-Fly Packaging service for video-on-demand.",
  },
  {
    value: "otfp_deliver_time",
    label: "otfp_deliver_time", 
    description: "Total amount of time spent delivering a response from the Fastly On-the-Fly Packaging service for video-on-demand (in seconds).",
  },
  {
    value: "otfp_manifests",
    label: "otfp_manifests", 
    description: "Number of responses that were manifest files from the Fastly On-the-Fly Packaging service for video-on-demand.",
  },
  {
    value: "otfp_resp_body_bytes",
    label: "otfp_resp_body_bytes", 
    description: "Total body bytes delivered from the Fastly On-the-Fly Packaging service for video-on-demand.",
  },
  {
    value: "otfp_resp_header_bytes",
    label: "otfp_resp_header_bytes", 
    description: "Total header bytes delivered from the Fastly On-the-Fly Packaging service for video-on-demand.",
  },
  {
    value: "otfp_shield",
    label: "otfp_shield", 
    description: "Number of responses that came from the Fastly On-the-Fly Packaging service for video-on-demand via a shield.",
  },
  {
    value: "otfp_shield_resp_body_bytes",
    label: "otfp_shield_resp_body_bytes", 
    description: "Total body bytes delivered via a shield for the Fastly On-the-Fly Packaging service for video-on-demand.",
  },
  {
    value: "otfp_shield_resp_header_bytes",
    label: "otfp_shield_resp_header_bytes", 
    description: "Total header bytes delivered via a shield for the Fastly On-the-Fly Packaging service for video-on-demand.",
  },
  {
    value: "otfp_shield_time",
    label: "otfp_shield_time", 
    description: "Total amount of time spent delivering a response via a shield from the Fastly On-the-Fly Packaging service for video-on-demand (in seconds).",
  },
  {
    value: "pass",
    label: "pass", 
    description: "Number of requests that passed through the CDN without being cached.",
  },
  {
    value: "pass_resp_body_bytes",
    label: "pass_resp_body_bytes", 
    description: "Total body bytes delivered for cache passes.",
  },
  {
    value: "pass_sub_count",
    label: "pass_sub_count", 
    description: "Number of executions of the vcl_pass Varnish subroutine.",
  },
  {
    value: "pass_sub_time",
    label: "pass_sub_time", 
    description: "Time spent inside the vcl_pass Varnish subroutine (in nanoseconds).",
  },
  {
    value: "pass_time",
    label: "pass_time", 
    description: "Total amount of time spent processing cache passes (in seconds).",
  },
  {
    value: "pci",
    label: "pci", 
    description: "Number of responses with the PCI flag turned on.",
  },
  {
    value: "pipe_sub_count",
    label: "pipe_sub_count", 
    description: "Number of executions of the vcl_pipe Varnish subroutine.",
  },
  {
    value: "pipe_sub_time",
    label: "pipe_sub_time", 
    description: "Time spent inside the vcl_pipe Varnish subroutine (in nanoseconds).",
  },
  {
    value: "predeliver_sub_count",
    label: "predeliver_sub_count", 
    description: "Number of executions of the vcl_predeliver Varnish subroutine.",
  },
  {
    value: "predeliver_sub_time",
    label: "predeliver_sub_time", 
    description: "Time spent inside the vcl_predeliver Varnish subroutine (in nanoseconds).",
  },
  {
    value: "prehash_sub_count",
    label: "prehash_sub_count", 
    description: "Number of executions of the vcl_prehash Varnish subroutine.",
  },
  {
    value: "prehash_sub_time",
    label: "prehash_sub_time", 
    description: "Time spent inside the vcl_prehash Varnish subroutine (in nanoseconds).",
  },
  {
    value: "recv_sub_count",
    label: "recv_sub_count", 
    description: "Number of executions of the vcl_recv Varnish subroutine.",
  },
  {
    value: "recv_sub_time",
    label: "recv_sub_time", 
    description: "Time spent inside the vcl_recv Varnish subroutine (in nanoseconds).",
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
    value: "requests",
    label: "requests", 
    description: "Number of requests processed.",
  },
  {
    value: "resp_body_bytes",
    label: "resp_body_bytes", 
    description: "Total body bytes delivered (edge_resp_body_bytes + shield_resp_body_bytes).",
  },
  {
    value: "resp_header_bytes",
    label: "resp_header_bytes", 
    description: "Total header bytes delivered (edge_resp_header_bytes + shield_resp_header_bytes).",
  },
  {
    value: "restarts",
    label: "restarts", 
    description: "Number of restarts performed.",
  },
  {
    value: "segblock_origin_fetches",
    label: "segblock_origin_fetches", 
    description: "Number of Range requests to origin for segments of resources when using segmented caching.",
  },
  {
    value: "segblock_shield_fetches",
    label: "segblock_shield_fetches", 
    description: "Number of Range requests to a shield for segments of resources when using segmented caching.",
  },
  {
    value: "shield",
    label: "shield", 
    description: "Number of requests from edge to the shield POP.",
  },
  {
    value: "shield_cache_fetches",
    label: "shield_cache_fetches", 
    description: "The total number of completed requests made to shields that returned cacheable content.",
  },
  {
    value: "shield_fetch_body_bytes",
    label: "shield_fetch_body_bytes", 
    description: "Total request body bytes sent to a shield.",
  },
  {
    value: "shield_fetch_header_bytes",
    label: "shield_fetch_header_bytes", 
    description: "Total request header bytes sent to a shield.",
  },
  {
    value: "shield_fetch_resp_body_bytes",
    label: "shield_fetch_resp_body_bytes", 
    description: "Total response body bytes sent from a shield to the edge.",
  },
  {
    value: "shield_fetch_resp_header_bytes",
    label: "shield_fetch_resp_header_bytes", 
    description: "Total response header bytes sent from a shield to the edge.",
  },
  {
    value: "shield_fetches",
    label: "shield_fetches", 
    description: "Number of requests made from one Fastly data center to another, as part of shielding.",
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
    value: "shield_revalidations",
    label: "shield_revalidations", 
    description: "Number of responses received from origin with a 304 status code, in response to an If-Modified-Since or If-None-Match request to a shield. Under regular scenarios, a revalidation will imply a cache hit. However, if using segmented caching this may result in a cache miss.",
  },
  {
    value: "status_1xx",
    label: "status_1xx", 
    description: "Number of \"Informational\" category status codes delivered.",
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
    description: "Number of responses sent with status code 206 (Partial Content).",
  },
  {
    value: "status_2xx",
    label: "status_2xx", 
    description: "Number of \"Success\" status codes delivered.",
  },
  {
    value: "status_301",
    label: "status_301", 
    description: "Number of responses sent with status code 301 (Moved Permanently).",
  },
  {
    value: "status_302",
    label: "status_302", 
    description: "Number of responses sent with status code 302 (Found).",
  },
  {
    value: "status_304",
    label: "status_304", 
    description: "Number of responses sent with status code 304 (Not Modified).",
  },
  {
    value: "status_3xx",
    label: "status_3xx", 
    description: "Number of \"Redirection\" codes delivered.",
  },
  {
    value: "status_400",
    label: "status_400", 
    description: "Number of responses sent with status code 400 (Bad Request).",
  },
  {
    value: "status_401",
    label: "status_401", 
    description: "Number of responses sent with status code 401 (Unauthorized).",
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
    description: "Number of responses sent with status code 416 (Range Not Satisfiable).",
  },
  {
    value: "status_429",
    label: "status_429", 
    description: "Number of responses sent with status code 429 (Too Many Requests).",
  },
  {
    value: "status_4xx",
    label: "status_4xx", 
    description: "Number of \"Client Error\" codes delivered.",
  },
  {
    value: "status_500",
    label: "status_500", 
    description: "Number of responses sent with status code 500 (Internal Server Error).",
  },
  {
    value: "status_501",
    label: "status_501", 
    description: "Number of responses sent with status code 501 (Not Implemented).",
  },
  {
    value: "status_502",
    label: "status_502", 
    description: "Number of responses sent with status code 502 (Bad Gateway).",
  },
  {
    value: "status_503",
    label: "status_503", 
    description: "Number of responses sent with status code 503 (Service Unavailable).",
  },
  {
    value: "status_504",
    label: "status_504", 
    description: "Number of responses sent with status code 504 (Gateway Timeout).",
  },
  {
    value: "status_505",
    label: "status_505", 
    description: "Number of responses sent with status code 505 (HTTP Version Not Supported).",
  },
  {
    value: "status_5xx",
    label: "status_5xx", 
    description: "Number of \"Server Error\" codes delivered.",
  },
  {
    value: "synth",
    label: "synth", 
    description: "Number of requests that returned a synthetic response (i.e., response objects created with the synthetic VCL statement).",
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
    value: "uncacheable",
    label: "uncacheable", 
    description: "Number of requests that were designated uncachable.",
  },
  {
    value: "video",
    label: "video", 
    description: "Number of responses with the video segment or video manifest MIME type (i.e., application/x-mpegurl, application/vnd.apple.mpegurl, application/f4m, application/dash+xml, application/vnd.ms-sstr+xml, ideo/mp2t, audio/aac, video/f4f, video/x-flv, video/mp4, audio/mp4).",
  },
  {
    value: "waf_blocked",
    label: "waf_blocked", 
    description: "Number of requests that triggered a WAF rule and were blocked.",
  },
  {
    value: "waf_logged",
    label: "waf_logged", 
    description: "Number of requests that triggered a WAF rule and were logged.",
  },
  {
    value: "waf_passed",
    label: "waf_passed", 
    description: "Number of requests that triggered a WAF rule and were passed.",
  },
];

const RealTimeMetricSelect = (props: Props): React.Node => {
  const { value, onChange } = props;

  return (
    <MultiSelectInput value={value} options={options} onChange={onChange} />
  );
};

export default RealTimeMetricSelect;