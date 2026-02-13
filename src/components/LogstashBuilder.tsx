"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, Trash2, ChevronRight, ChevronDown, Settings, Plus, ArrowRightFromLine, 
  FolderOpen, Maximize2, X, List, MinusCircle, Search, MessageSquare, Activity, 
  RotateCcw, Download, Share2, GripVertical, AlertCircle, Code, Save, ChevronsDown, 
  ChevronsUp, Copy, Check, AlertTriangle, Upload, WrapText, ChevronLeft 
} from 'lucide-react';

// --- 1. Constants & Definitions ---

const COMMON_KEYS = {
  input: ["add_field", "codec", "enable_metric", "id", "tags", "type"],
  filter: ["add_field", "add_tag", "enable_metric", "id", "periodic_flush", "remove_field", "remove_tag"],
  output: ["codec", "enable_metric", "id"],
}

const COMMON_DEFS = {
  add_field: "{}",
  codec: '"plain"',
  enable_metric: "true",
  id: '"my_id"',
  tags: "[]",
  type: '""',
  add_tag: "[]",
  periodic_flush: "false",
  remove_field: "[]",
  remove_tag: "[]",
}

const REQUIRED_FIELDS = {
  input: {
    azure_event_hubs: ["storage_connection", "event_hub_connections"],
    beats: ["port"],
    cloudwatch: ["region", "namespace"],
    couchdb_changes: ["host", "db"],
    dead_letter_queue: ["path", "pipeline_id"],
    elastic_agent: ["port"],
    elastic_serverless_forwarder: ["port"],
    elasticsearch: ["hosts", "index"],
    exec: ["command", "interval"],
    file: ["path"],
    ganglia: ["port"],
    gelf: ["port"],
    generator: ["count", "message"],
    github: ["port"],
    google_cloud_storage: ["bucket_id"],
    google_pubsub: ["project_id", "topic"],
    graphite: ["port"],
    heartbeat: ["interval", "message"],
    http: ["port"],
    http_poller: ["urls", "schedule"],
    imap: ["host", "user", "password"],
    irc: ["host", "channels", "nick"],
    java_generator: [],
    java_stdin: [],
    jdbc: ["jdbc_connection_string", "jdbc_driver_class", "statement"],
    jms: ["broker_url", "destination"],
    jmx: ["path", "polling_frequency"],
    kafka: ["bootstrap_servers", "topics"],
    kinesis: ["kinesis_stream_name"],
    log4j: ["host", "port"],
    logstash: ["port"],
    lumberjack: ["port", "ssl_certificate", "ssl_key"],
    meetup: ["meetupkey"],
    pipe: ["command"],
    puppet_facter: [],
    rabbitmq: ["host", "queue"],
    redis: ["host", "key", "data_type"],
    relp: ["port"],
    rss: ["url", "interval"],
    s3: ["bucket"],
    "s3-sns-sqs": ["s3_bucket", "sqs_queue"],
    salesforce: ["client_id", "client_secret", "username", "password", "security_token"],
    snmp: ["hosts", "get", "interval"],
    snmptrap: ["port"],
    sqlite: ["path"],
    sqs: ["queue"],
    stdin: [],
    stomp: ["host", "port", "destination"],
    syslog: ["port"],
    tcp: ["port"],
    twitter: ["consumer_key", "consumer_secret", "oauth_token", "oauth_token_secret"],
    udp: ["port"],
    unix: ["path"],
    varnishlog: [],
    websocket: ["url"],
    wmi: ["query"],
    xmpp: ["host", "user", "password"],
  },
  filter: {
    grok: ["match"],
    mutate: [],
    json: ["source"],
    json_encode: ["source", "target"],
    date: ["match", "target"],
    drop: [],
    dissect: ["mapping"],
    csv: ["columns"],
    cidr: ["address", "network"],
    cipher: ["algorithm", "mode", "key", "iv_random_length", "source", "target"],
    clone: ["clones"],
    de_dot: [],
    dns: ["resolve", "reverse", "action"],
    elapsed: ["start_tag", "end_tag", "unique_id_field"],
    elasticsearch: ["index"],
    elastic_integration: ["hosts", "username", "password"],
    environment: ["add_metadata_from_env"],
    extractnumbers: ["source"],
    fingerprint: ["source", "target", "method"],
    http: ["url", "verb"],
    i18n: [],
    java_uuid: ["target"],
    jdbc_static: ["loaders", "local_db_objects", "local_lookups", "jdbc_connection_string", "jdbc_driver_class"],
    jdbc_streaming: ["statement", "jdbc_connection_string", "jdbc_driver_class", "target"],
    kv: ["source"],
    memcached: ["hosts"],
    metricize: ["metrics"],
    metrics: [],
    prune: [],
    range: ["ranges"],
    ruby: ["code"],
    sleep: ["time"],
    split: ["field"],
    syslog_pri: [],
    threats_classifier: ["username", "password"],
    throttle: ["key"],
    tld: ["source"],
    translate: ["source", "target", "dictionary"],
    truncate: ["fields", "length_bytes"],
    urldecode: ["field"],
    useragent: ["source"],
    uuid: ["target"],
    wurfl_device_detection: ["source"],
    xml: ["source"],
    age: [],
    bytes: ["source", "target"],
    alter: [],
    aggregate: ["task_id", "code"],
  },
  output: {
    boundary: ["api_key", "org_id"],
    circonus: ["api_token", "app_name"],
    cloudwatch: ["access_key_id", "secret_access_key", "region"],
    csv: ["path", "fields"],
    datadog: ["api_key"],
    datadog_metrics: ["api_key"],
    dynatrace: ["ingest_endpoint_url", "api_key"],
    elastic_app_search: ["url", "api_key"],
    elastic_workplace_search: ["url", "access_token"],
    elasticsearch: ["hosts", "index"],
    email: ["to", "address", "username", "password"],
    exec: ["command"],
    file: ["path"],
    ganglia: ["host", "port"],
    gelf: ["host"],
    google_bigquery: ["project_id", "dataset", "table_prefix", "json_key_file"],
    google_cloud_storage: ["bucket", "json_key_file"],
    google_pubsub: ["project_id", "topic", "json_key_file"],
    graphite: ["host", "port"],
    graphtastic: ["host", "port"],
    http: ["url", "http_method"],
    influxdb: ["host", "db", "measurement"],
    irc: ["host", "channels"],
    java_stdout: [],
    juggernaut: ["host"],
    kafka: ["bootstrap_servers", "topic_id"],
    librato: ["account_id", "api_token"],
    logstash: ["hosts"],
    loggly: ["key"],
    lumberjack: ["hosts", "port", "ssl_certificate"],
    metriccatcher: ["host", "port"],
    mongodb: ["uri", "database", "collection"],
    nagios: [],
    nagios_nsca: ["host", "port", "nagios_host", "nagios_service"],
    opentsdb: ["host", "port"],
    pagerduty: ["service_key"],
    pipe: ["command"],
    rabbitmq: ["host"],
    redis: ["host", "data_type", "key"],
    redmine: ["url", "token"],
    riak: ["nodes"],
    riemann: ["host"],
    s3: ["access_key_id", "secret_access_key", "bucket"],
    sink: [],
    sns: ["access_key_id", "secret_access_key", "arn"],
    solr_http: ["solr_url"],
    sqs: ["access_key_id", "secret_access_key", "queue"],
    statsd: ["host", "port"],
    stdout: [],
    stomp: ["host", "destination"],
    syslog: ["host", "port"],
    tcp: ["host", "port", "mode"],
    timber: ["api_key"],
    udp: ["host", "port"],
    webhdfs: ["host", "user", "path"],
    websocket: ["host", "port"],
    xmpp: ["host", "user", "password", "rooms"],
    zabbix: ["zabbix_host"],
  },
  // Default fallbacks for logic/comments
  logic: {},
  comment: {},
}

const PLUGIN_DEFINITIONS = {
  input: {
    azure_event_hubs: {
      checkpoint_interval: "5",
      config_mode: '"basic"',
      consumer_group: '"$Default"',
      decorate_events: "false",
      event_hub_connection: '""',
      event_hub_connections: "[]",
      event_hubs: "[]",
      initial_position: '"beginning"',
      initial_position_look_back: "86400",
      max_batch_size: "125",
      storage_connection: '""',
      storage_container: '""',
      threads: "16",
    },
    beats: {
      add_hostname: "false",
      client_inactivity_timeout: "60",
      ecs_compatibility: '"disabled"',
      enrich: "[]",
      event_loop_threads: "4",
      executor_threads: "4",
      host: '"0.0.0.0"',
      include_codec_tag: "true",
      port: "5044",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_client_authentication: '"none"',
      ssl_enabled: "false",
      ssl_handshake_timeout: "10000",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_supported_protocols: "[]",
    },
    cloudwatch: {
      access_key_id: '""',
      aws_credentials_file: '""',
      combined: "false",
      endpoint: '""',
      filters: "{}",
      interval: "900",
      metrics: '["CPUUtilization"]',
      namespace: '"AWS/EC2"',
      period: "300",
      proxy_uri: '""',
      region: '"us-east-1"',
      role_arn: '""',
      role_session_name: '""',
      secret_access_key: '""',
      session_token: '""',
      statistics: '["Average"]',
      use_aws_bundled_ca: "false",
      use_ssl: "true",
      web_identity_token_file: '""',
    },
    couchdb_changes: {
      always_reconnect: "true",
      ca_file: '""',
      db: '"logs"',
      heartbeat: "true",
      host: '"localhost"',
      ignore_attachments: "true",
      initial_sequence: "0",
      keep_id: "false",
      keep_revision: "false",
      password: '""',
      port: "5984",
      reconnect_delay: "10",
      secure: "false",
      sequence_path: '""',
      timeout: "10000",
      username: '""',
    },
    dead_letter_queue: {
      clean_consumed: "true",
      commit_offsets: "true",
      path: '"/var/lib/logstash/dead_letter_queue"',
      pipeline_id: '"main"',
      sincedb_path: '""',
      start_timestamp: '"2024-01-01T00:00:00"',
    },
    elastic_agent: {
      add_hostname: "false",
      client_inactivity_timeout: "60",
      ecs_compatibility: '"v1"',
      enrich: "[]",
      event_loop_threads: "4",
      executor_threads: "4",
      host: '"0.0.0.0"',
      include_codec_tag: "true",
      port: "5044",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_client_authentication: '"none"',
      ssl_enabled: "true",
      ssl_handshake_timeout: "10000",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_supported_protocols: "[]",
    },
    elastic_serverless_forwarder: {
      auth_basic_password: '""',
      auth_basic_username: '""',
      host: '"0.0.0.0"',
      port: "5044",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_client_authentication: '"none"',
      ssl_enabled: "true",
      ssl_handshake_timeout: "10000",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_supported_protocols: "[]",
      ssl_verification_mode: '"full"',
    },
    elasticsearch: {
      api_key: '""',
      ca_trusted_fingerprint: '""',
      cloud_auth: '""',
      cloud_id: '""',
      connect_timeout_seconds: "10",
      custom_headers: "{}",
      docinfo: "false",
      docinfo_fields: '["_index", "_id", "_type"]',
      docinfo_target: '"@metadata"',
      ecs_compatibility: '"disabled"',
      hosts: '["localhost:9200"]',
      index: '"logstash-*"',
      last_run_metadata_path: '""',
      password: '""',
      proxy: '""',
      query: '{ "query": { "match_all": {} } }',
      query_type: '"scroll"',
      request_timeout_seconds: "60",
      response_type: '"java"',
      retries: "3",
      schedule: '""',
      schedule_overlap: "false",
      scroll: '"1m"',
      search_api: '"search"',
      size: "1000",
      slices: "1",
      socket_timeout_seconds: "60",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_enabled: "false",
      ssl_key: '""',
      ssl_keystore_password: '""',
      ssl_keystore_path: '""',
      ssl_keystore_type: '""',
      ssl_supported_protocols: "[]",
      ssl_truststore_password: '""',
      ssl_truststore_path: '""',
      ssl_truststore_type: '""',
      ssl_verification_mode: '"full"',
      target: '""',
      tracking_field: '"@timestamp"',
      tracking_field_seed: "0",
      user: '""',
    },
    exec: {
      command: "\"echo 'hello'\"",
      ecs_compatibility: '"disabled"',
      interval: "60",
      schedule: '""',
    },
    file: {
      check_archive_validity: "false",
      close_older: '"1 hour"',
      delimiter: '"\\n"',
      discover_interval: "15",
      ecs_compatibility: '"disabled"',
      exclude: "[]",
      exit_after_read: "false",
      file_chunk_count: "4611686018427387903",
      file_chunk_size: "32768",
      file_completed_action: '"delete"',
      file_completed_log_path: '""',
      file_sort_by: '"last_modified"',
      file_sort_direction: '"desc"',
      ignore_older: "86400",
      max_open_files: "4095",
      mode: '"tail"',
      path: '["/var/log/*.log"]',
      sincedb_clean_after: '"2 weeks"',
      sincedb_path: '""',
      sincedb_write_interval: "15",
      start_position: '"end"',
      stat_interval: "1",
    },
    ganglia: {
      host: '"0.0.0.0"',
      port: "8649",
    },
    gelf: {
      host: '"0.0.0.0"',
      port: "12201",
      port_tcp: "12201",
      port_udp: "12201",
      remap: "true",
      strip_leading_underscore: "true",
      use_tcp: "false",
      use_udp: "true",
    },
    generator: {
      count: "0",
      ecs_compatibility: '"disabled"',
      lines: "[]",
      message: '"Hello world!"',
      threads: "1",
    },
    github: {
      drop_invalid: "false",
      ip: '"0.0.0.0"',
      port: "8080",
      secret_token: '""',
    },
    google_cloud_storage: {
      bucket_id: '""',
      delete: "false",
      file_exclude: '""',
      file_matches: '".*"',
      interval: "60",
      json_key_file: '""',
      metadata_key: '"metadata"',
      processed_db_path: '""',
      unpack_gzip: "true",
    },
    google_pubsub: {
      create_subscription: "true",
      include_metadata: "false",
      json_key_file: '""',
      max_messages: "5",
      project_id: '""',
      subscription: '""',
      topic: '""',
    },
    graphite: {
      "data_timeout (DEPRECATED)": '""',
      host: '"0.0.0.0"',
      mode: '"server"',
      port: "2003",
      proxy_protocol: "false",
      "ssl_cacert (DEPRECATED)": '""',
      ssl_cert: '""',
      ssl_enable: "false",
      ssl_extra_chain_certs: "[]",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_verify: "false",
    },
    heartbeat: {
      count: "-1",
      ecs_compatibility: '"disabled"',
      interval: "60",
      message: '"ok"',
      sequence: '"default"',
      threads: "1",
    },
    http: {
      additional_codecs: "{}",
      ecs_compatibility: '"disabled"',
      host: '"0.0.0.0"',
      max_content_length: "104857600",
      max_pending_requests: "200",
      password: '""',
      port: "8080",
      remote_host_target_field: '"host"',
      request_headers_target_field: '"headers"',
      response_code: "200",
      response_headers: "{}",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_client_authentication: '"none"',
      ssl_enabled: "false",
      ssl_handshake_timeout: "10000",
      ssl_key: '""',
      ssl_keystore_password: '""',
      ssl_keystore_path: '""',
      ssl_keystore_type: '""',
      ssl_supported_protocols: "[]",
      ssl_truststore_password: '""',
      ssl_truststore_path: '""',
      ssl_truststore_type: '""',
      threads: "4",
      user: '""',
    },
    http_poller: {
      automatic_retries: "1",
      connect_timeout: "10",
      cookies: "true",
      ecs_compatibility: '"disabled"',
      follow_redirects: "true",
      keepalive: "true",
      metadata_target: '"@metadata"',
      password: '""',
      pool_max: "50",
      pool_max_per_route: "25",
      proxy: '""',
      request_timeout: "60",
      retry_non_idempotent: "false",
      schedule: "{}",
      socket_timeout: "10",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_enabled: "false",
      ssl_key: '""',
      ssl_keystore_password: '""',
      ssl_keystore_path: '""',
      ssl_keystore_type: '""',
      ssl_supported_protocols: "[]",
      ssl_truststore_password: '""',
      ssl_truststore_path: '""',
      ssl_truststore_type: '""',
      ssl_verification_mode: '"full"',
      target: '""',
      urls: "{}",
      user: '""',
      validate_after_inactivity: "2000",
    },
    imap: {
      attachments_target: '""',
      check_interval: "300",
      content_type: '"text/plain"',
      delete: "false",
      ecs_compatibility: '"disabled"',
      expunge: "false",
      fetch_count: "50",
      folder: '"INBOX"',
      headers_target: '""',
      host: '""',
      lowercase_headers: "true",
      password: '""',
      port: "143",
      save_attachments: "false",
      secure: "true",
      sincedb_path: '""',
      strip_attachments: "false",
      uid_tracking: "false",
      user: '""',
      verify_cert: "true",
    },
    irc: {
      catch_all: "false",
      channels: "[]",
      get_stats: "true",
      host: '""',
      nick: '"logstash"',
      password: '""',
      port: "6667",
      real: '"logstash"',
      secure: "false",
      stats_interval: "5",
      user: '"logstash"',
    },
    java_generator: {
      count: "0",
      eps: "0",
      lines: "[]",
      message: '"Hello world!"',
      threads: "1",
    },
    java_stdin: {},
    jdbc: {
      clean_run: "false",
      columns_charset: "{}",
      connection_retry_attempts: "1",
      connection_retry_attempts_wait_time: "0.5",
      interval: '""',
      jdbc_connection_string: '""',
      jdbc_default_timezone: '"UTC"',
      jdbc_driver_class: '""',
      jdbc_driver_library: '""',
      jdbc_fetch_size: "null",
      jdbc_page_size: "100000",
      jdbc_paging_enabled: "false",
      jdbc_paging_mode: '"auto"',
      jdbc_password: '""',
      jdbc_password_filepath: '""',
      jdbc_pool_timeout: "5",
      jdbc_user: '""',
      jdbc_validate_connection: "false",
      jdbc_validation_timeout: "3600",
      last_run_metadata_path: '""',
      lowercase_column_names: "true",
      parameters: "{}",
      period: '""',
      plugin_timezone: '"utc"',
      prepared_statement_bind_values: "[]",
      prepared_statement_name: '""',
      record_last_run: "true",
      schedule: '""',
      sequel_opts: "{}",
      sql_log_level: '"info"',
      statement: '""',
      statement_filepath: '""',
      statement_retry_attempts: "-1",
      statement_retry_attempts_wait_time: "100",
      target: '""',
      tracking_column: '""',
      tracking_column_type: '"numeric"',
      use_column_value: "false",
      use_prepared_statements: "false",
    },
    jms: {
      broker_url: '""',
      destination: '""',
      durable_subscriber: "false",
      durable_subscriber_client_id: '""',
      durable_subscriber_name: '""',
      ecs_compatibility: '"disabled"',
      factory: '""',
      factory_settings: "{}",
      headers_target: '""',
      include_body: "true",
      include_header: "true",
      include_headers: "true",
      include_properties: "true",
      interval: "10",
      jndi_context: "{}",
      jndi_name: '""',
      keystore: '""',
      keystore_password: '""',
      oracle_aq_buffered_messages: "false",
      password: '""',
      properties_target: '""',
      pub_sub: "false",
      require_jars: "[]",
      runner: '"consumer"',
      selector: '""',
      skip_headers: "[]",
      skip_properties: "[]",
      system_properties: "{}",
      target: '""',
      threads: "1",
      timeout: "-1",
      truststore: '""',
      truststore_password: '""',
      use_jms_timestamp: "false",
      username: '""',
      yaml_file: '""',
      yaml_section: '""',
    },
    jmx: {
      nb_thread: "4",
      path: '""',
      polling_frequency: "60",
    },
    kafka: {
      auto_commit_interval_ms: "5000",
      auto_create_topics: "true",
      auto_offset_reset: '"latest"',
      bootstrap_servers: '"localhost:9092"',
      check_crcs: "true",
      client_dns_lookup: '"default"',
      client_id: '""',
      client_rack: '""',
      connections_max_idle_ms: "540000",
      consumer_threads: "1",
      decorate_events: "false",
      enable_auto_commit: "true",
      exclude_internal_topics: "true",
      fetch_max_bytes: "52428800",
      fetch_max_wait_ms: "500",
      fetch_min_bytes: "1",
      group_id: '"logstash"',
      group_instance_id: '""',
      group_protocol: '"classic"',
      heartbeat_interval_ms: "3000",
      isolation_level: '"read_uncommitted"',
      jaas_path: '""',
      kerberos_config: '""',
      key_deserializer_class: '"org.apache.kafka.common.serialization.StringDeserializer"',
      max_partition_fetch_bytes: "1048576",
      max_poll_interval_ms: "300000",
      max_poll_records: "500",
      metadata_max_age_ms: "300000",
      partition_assignment_strategy: '["org.apache.kafka.clients.consumer.RangeAssignor"]',
      poll_timeout_ms: "100",
      receive_buffer_bytes: "65536",
      reconnect_backoff_max_ms: "1000",
      reconnect_backoff_ms: "50",
      request_timeout_ms: "30000",
      retry_backoff_ms: "100",
      sasl_client_callback_handler_class: '""',
      sasl_iam_jar_paths: "[]",
      sasl_jaas_config: '""',
      sasl_kerberos_service_name: '""',
      sasl_login_callback_handler_class: '""',
      sasl_login_connect_timeout_ms: "10000",
      sasl_login_read_timeout_ms: "10000",
      sasl_login_retry_backoff_max_ms: "1000",
      sasl_login_retry_backoff_ms: "100",
      sasl_mechanism: '"GSSAPI"',
      sasl_oauthbearer_scope_claim_name: '"scope"',
      sasl_oauthbearer_token_endpoint_url: '""',
      schema_registry_key: '""',
      schema_registry_proxy: '""',
      schema_registry_secret: '""',
      schema_registry_ssl_keystore_location: '""',
      schema_registry_ssl_keystore_password: '""',
      schema_registry_ssl_keystore_type: '""',
      schema_registry_ssl_truststore_location: '""',
      schema_registry_ssl_truststore_password: '""',
      schema_registry_ssl_truststore_type: '""',
      schema_registry_url: '""',
      schema_registry_validation: "false",
      security_protocol: '"PLAINTEXT"',
      send_buffer_bytes: "131072",
      session_timeout_ms: "45000",
      ssl_endpoint_identification_algorithm: '"https"',
      ssl_key_password: '""',
      ssl_keystore_location: '""',
      ssl_keystore_password: '""',
      ssl_keystore_type: '""',
      ssl_truststore_location: '""',
      ssl_truststore_password: '""',
      ssl_truststore_type: '""',
      topics: '["logstash"]',
      topics_pattern: '""',
      value_deserializer_class: '"org.apache.kafka.common.serialization.StringDeserializer"',
    },
    kinesis: {
      additional_settings: '""',
      application_name: '"logstash_kinesis_ingress"',
      checkpoint_interval_seconds: "60",
      http_proxy: '""',
      initial_position_in_stream: '"TRIM_HORIZON"',
      kinesis_stream_name: '""',
      metrics: '"null"',
      non_proxy_hosts: '""',
      profile: '""',
      region: '"us-east-1"',
      role_arn: '""',
      role_session_name: '""',
    },
    logstash: {
      host: '"0.0.0.0"',
      password: '""',
      port: "9800",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_client_authentication: '"none"',
      ssl_enabled: "true",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_keystore_password: '""',
      ssl_keystore_path: '""',
      username: '"logstash_user"',
    },
    log4j: {
      host: '"0.0.0.0"',
      mode: '"server"',
      port: "4560",
      proxy_protocol: "false",
    },
    lumberjack: {
      congestion_threshold: "5",
      host: '"0.0.0.0"',
      port: "5000",
      ssl_certificate: '""',
      ssl_key: '""',
      ssl_key_passphrase: '""',
    },
    meetup: {
      eventstatus: '"upcoming"',
      groupid: '""',
      interval: "3600",
      meetupkey: '""',
      text: '""',
      urlname: '""',
      venueid: '""',
    },
    pipe: {
      command: '""',
      ecs_compatibility: '"disabled"',
    },
    puppet_facter: {
      environment: '""',
      host: '"0.0.0.0"',
      interval: "600",
      port: "8140",
      private_key: '""',
      public_key: '""',
      ssl: "true",
    },
    rabbitmq: {
      ack: "true",
      arguments: "{}",
      auto_delete: "false",
      automatic_recovery: "true",
      connect_retry_interval: "60",
      connection_timeout: "1000",
      durable: "true",
      exchange: '"logstash"',
      exchange_type: '"direct"',
      exclusive: "false",
      heartbeat: "0",
      host: '"localhost"',
      key: '"logstash"',
      "Metadata mapping": "{}",
      metadata_enabled: "false",
      passive: "false",
      password: '"guest"',
      port: "5672",
      prefetch_count: "256",
      queue: '""',
      ssl: "false",
      ssl_certificate_password: '""',
      ssl_certificate_path: '""',
      ssl_version: '"TLSv1.2"',
      subscription_retry_interval_seconds: "5",
      threads: "1",
      user: '"guest"',
      vhost: '"/"',
    },
    redis: {
      batch: "false",
      batch_events: "50",
      batch_timeout: "5",
      congestion_interval: "1",
      congestion_threshold: "5",
      data_type: '"list"',
      db: "0",
      host: '["127.0.0.1"]',
      key: '""',
      password: '""',
      port: "6379",
      reconnect_interval: "1",
      shuffle_hosts: "true",
      ssl: "false",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_enabled: "false",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_supported_protocols: "[]",
      ssl_verification_mode: '"full"',
      timeout: "5",
    },
    relp: {
      host: '"0.0.0.0"',
      port: "514",
      ssl_cacert: '""',
      ssl_cert: '""',
      ssl_enable: "false",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_verify: "true",
    },
    rss: {
      interval: "120",
      url: '""',
    },
    s3: {
      access_key_id: '""',
      additional_settings: "{}",
      aws_credentials_file: '""',
      backup_add_prefix: '""',
      backup_to_bucket: '""',
      backup_to_dir: '""',
      bucket: '""',
      delete: "false",
      ecs_compatibility: '"disabled"',
      endpoint: '""',
      exclude_pattern: '""',
      gzip_pattern: '""',
      include_object_properties: "false",
      interval: "60",
      prefix: '""',
      proxy_uri: '""',
      region: '"us-east-1"',
      role_arn: '""',
      role_session_name: '""',
      secret_access_key: '""',
      session_token: '""',
      sincedb_path: '""',
      temporary_directory: '"/tmp/logstash"',
      use_aws_bundled_ca: "false",
      watch_for_new_files: "true",
      web_identity_token_file: '""',
    },
    "s3-sns-sqs": {
      access_key_id: '""',
      region: '"us-east-1"',
      s3_bucket: '""',
      secret_access_key: '""',
      sqs_queue: '""',
    },
    salesforce: {
      api_version: '"39.0"',
      changed_data_filter: '"LastModifiedDate > {latest}"',
      client_id: '""',
      client_secret: '""',
      interval: "60",
      password: '""',
      security_token: '""',
      sfdc_fields: "[]",
      sfdc_filters: "[]",
      sfdc_instance_url: '""',
      sfdc_object_name: '""',
      timeout: "10000",
      to_underscores: "false",
      tracking_field: '""',
      tracking_field_value_file: '""',
      use_test_sandbox: "false",
      use_tooling_api: "false",
      username: '""',
    },
    snmp: {
      auth_pass: '""',
      auth_protocol: '"md5"',
      ecs_compatibility: '"disabled"',
      get: "[]",
      hosts: "[]",
      interval: "30",
      local_engine_id: '""',
      mib_paths: "[]",
      oid_map_field_values: "true",
      oid_mapping_format: '"ruby_snmp"',
      oid_path_length: "0",
      oid_root_skip: "0",
      poll_hosts_timeout: "2",
      priv_pass: '""',
      priv_protocol: '"des"',
      security_level: '"authPriv"',
      security_name: '""',
      tables: "[]",
      target: '""',
      threads: "1",
      use_provided_mibs: "true",
      walk: "[]",
    },
    snmptrap: {
      auth_pass: '""',
      auth_protocol: '"md5"',
      community: '"public"',
      ecs_compatibility: '"disabled"',
      host: '"0.0.0.0"',
      mib_paths: "[]",
      oid_map_field_values: "true",
      oid_mapping_format: '"ruby_snmp"',
      oid_path_length: "0",
      oid_root_skip: "0",
      port: "1062",
      priv_pass: '""',
      priv_protocol: '"des"',
      security_level: '"authPriv"',
      security_name: '""',
      supported_transports: '["udp", "tcp"]',
      supported_versions: '["1", "2c"]',
      target: '""',
      threads: "1",
      use_provided_mibs: "true",
      yamlmibdir: '""',
    },
    sqlite: {
      batch: "5",
      exclude_tables: "[]",
      path: '""',
    },
    sqs: {
      access_key_id: '""',
      additional_settings: "{}",
      aws_credentials_file: '""',
      endpoint: '""',
      id_field: '""',
      md5_field: '""',
      polling_frequency: "20",
      proxy_uri: '""',
      queue: '""',
      queue_owner_aws_account_id: '""',
      region: '"us-east-1"',
      role_arn: '""',
      role_session_name: '""',
      secret_access_key: '""',
      sent_timestamp_field: '""',
      session_token: '""',
      threads: "1",
      use_aws_bundled_ca: "false",
      web_identity_token_file: '""',
    },
    stdin: {
      ecs_compatibility: '"disabled"',
    },
    stomp: {
      destination: '""',
      host: '"localhost"',
      password: '""',
      port: "61613",
      reconnect: "true",
      reconnect_interval: "5",
      user: '""',
      vhost: '""',
    },
    syslog: {
      ecs_compatibility: '"disabled"',
      facility_labels:
        '["kernel", "user-level", "mail", "daemon", "security/authorization", "syslogd", "line printer", "network news", "uucp", "clock", "security/authorization", "ftp", "ntp", "log audit", "log alert", "clock", "local0", "local1", "local2", "local3", "local4", "local5", "local6", "local7"]',
      grok_pattern: '"<%{POSINT:priority}>%{SYSLOGLINE}"',
      host: '"0.0.0.0"',
      locale: '""',
      port: "514",
      proxy_protocol: "false",
      severity_labels: '["Emergency", "Alert", "Critical", "Error", "Warning", "Notice", "Debug"]',
      syslog_field: '"message"',
      timezone: '""',
      use_labels: "true",
    },
    tcp: {
      dns_reverse_lookup_enabled: "true",
      ecs_compatibility: '"disabled"',
      host: '"0.0.0.0"',
      mode: '"server"',
      port: "5000",
      proxy_protocol: "false",
      ssl_certificate: '""',
      ssl_certificate_authorities: "[]",
      ssl_cipher_suites: "[]",
      ssl_client_authentication: '"none"',
      ssl_enabled: "false",
      ssl_extra_chain_certs: "[]",
      ssl_key: '""',
      ssl_key_passphrase: '""',
      ssl_supported_protocols: "[]",
      ssl_verification_mode: '"full"',
      tcp_keep_alive: "true",
    },
    twitter: {
      consumer_key: '""',
      consumer_secret: '""',
      ecs_compatibility: '"disabled"',
      follows: "[]",
      full_tweet: "false",
      ignore_retweets: "false",
      keywords: "[]",
      languages: "[]",
      locations: "[]",
      oauth_token: '""',
      oauth_token_secret: '""',
      proxy_address: '""',
      proxy_port: "8080",
      rate_limit_reset_in: "300",
      target: '""',
      use_proxy: "false",
      use_samples: "false",
    },
    udp: {
      buffer_size: "65536",
      ecs_compatibility: '"disabled"',
      host: '"0.0.0.0"',
      port: "5000",
      queue_size: "2000",
      receive_buffer_bytes: "65536",
      source_ip_fieldname: '""',
      workers: "2",
    },
    unix: {
      data_timeout: "-1",
      ecs_compatibility: '"disabled"',
      force_unlink: "false",
      mode: '"server"',
      path: '""',
      socket_not_present_retry_interval_seconds: "5",
    },
    varnishlog: {
      threads: "1",
    },
    websocket: {
      mode: '"client"',
      url: '""',
    },
    wmi: {
      host: '""',
      interval: "10",
      namespace: '"root\\cimv2"',
      password: '""',
      query: '""',
      user: '""',
    },
    xmpp: {
      host: '""',
      password: '""',
      rooms: "[]",
      user: '""',
    },
  },
};

const LIBRARY_ITEMS = [
  {
    category: "input",
    label: "Inputs",
    items: [
      "azure_event_hubs",
      "beats",
      "cloudwatch",
      "couchdb_changes",
      "dead_letter_queue",
      "elastic_agent",
      "elastic_serverless_forwarder",
      "elasticsearch",
      "exec",
      "file",
      "ganglia",
      "gelf",
      "generator",
      "github",
      "google_cloud_storage",
      "google_pubsub",
      "graphite",
      "heartbeat",
      "http",
      "http_poller",
      "imap",
      "irc",
      "java_generator",
      "java_stdin",
      "jdbc",
      "jms",
      "jmx",
      "kafka",
      "kinesis",
      "log4j",
      "logstash",
      "lumberjack",
      "meetup",
      "pipe",
      "puppet_facter",
      "rabbitmq",
      "redis",
      "relp",
      "rss",
      "s3",
      "s3-sns-sqs",
      "salesforce",
      "snmp",
      "snmptrap",
      "sqlite",
      "sqs",
      "stdin",
      "stomp",
      "syslog",
      "tcp",
      "twitter",
      "udp",
      "unix",
      "varnishlog",
      "websocket",
      "wmi",
      "xmpp",
    ],
  },
  {
    category: "filter",
    label: "Filters",
    items: [
      "age",
      "aggregate",
      "alter",
      "bytes",
      "cidr",
      "cipher",
      "clone",
      "csv",
      "date",
      "de_dot",
      "dissect",
      "dns",
      "drop",
      "elapsed",
      "elasticsearch",
      "elastic_integration",
      "environment",
      "extractnumbers",
      "fingerprint",
      "geoip",
      "grok",
      "http",
      "i18n",
      "java_uuid",
      "jdbc_static",
      "jdbc_streaming",
      "json",
      "json_encode",
      "kv",
      "memcached",
      "metricize",
      "metrics",
      "mutate",
      "prune",
      "range",
      "ruby",
      "sleep",
      "split",
      "syslog_pri",
      "threats_classifier",
      "throttle",
      "tld",
      "translate",
      "truncate",
      "urldecode",
      "useragent",
      "uuid",
      "wurfl_device_detection",
      "xml",
    ],
  },
  {
    category: "output",
    label: "Outputs",
    items: [
      "boundary",
      "circonus",
      "cloudwatch",
      "csv",
      "datadog",
      "datadog_metrics",
      "dynatrace",
      "elastic_app_search",
      "elastic_workplace_search",
      "elasticsearch",
      "email",
      "exec",
      "file",
      "ganglia",
      "gelf",
      "google_bigquery",
      "google_cloud_storage",
      "google_pubsub",
      "graphite",
      "graphtastic",
      "http",
      "influxdb",
      "irc",
      "java_stdout",
      "juggernaut",
      "kafka",
      "librato",
      "logstash",
      "loggly",
      "lumberjack",
      "metriccatcher",
      "mongodb",
      "nagios",
      "nagios_nsca",
      "opentsdb",
      "pagerduty",
      "pipe",
      "rabbitmq",
      "redis",
      "redmine",
      "riak",
      "riemann",
      "s3",
      "sink",
      "sns",
      "solr_http",
      "sqs",
      "statsd",
      "stdout",
      "stomp",
      "syslog",
      "tcp",
      "timber",
      "udp",
      "webhdfs",
      "websocket",
      "xmpp",
      "zabbix",
    ],
  },
  { category: "logic", label: "Logic", items: ["else", "else if", "if"] },
  { category: "comment", label: "Comments", items: ["Comment"] },
]

const INITIAL_STATE = [
  { id: "root-input", type: "section", name: "input", children: [], isRoot: true },
  { id: "root-filter", type: "section", name: "filter", children: [], isRoot: true },
  { id: "root-output", type: "section", name: "output", children: [], isRoot: true },
];

// --- 2. Helper Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const findNode = (nodes: any[], id: string, parent = null): any => {
  for (const node of nodes) {
    if (node.id === id) return { node, parent };
    if (node.children) {
      const found = findNode(node.children, id, node);
      if (found) return found;
    }
  }
  return null;
};

const getRootSectionName = (nodes: any[], nodeId: string) => {
  const findRoot = (list: any[], targetId: string, currentRoot: string | null): string | null => {
    for (const node of list) {
      if (node.id === targetId) return currentRoot;
      if (node.children) {
        const result = findRoot(node.children, targetId, currentRoot || (node.isRoot ? node.name : null));
        if (result) return result;
      }
    }
    return null;
  };
  return findRoot(nodes, nodeId, null);
};

const generateConfigString = (nodes: any[], depth = 0) => {
  let output = "";
  const indent = "  ".repeat(depth);

  nodes.forEach((node) => {
    if (node.type === "section") {
      output += `${node.name} {\n${generateConfigString(node.children, depth + 1)}}\n\n`;
    } else if (node.type === "comment") {
      output += `${indent}# ${node.text || "Empty comment"}\n`;
    } else if (node.type === "conditional") {
      const condStr = node.name === "else" ? "else" : `${node.name} ${node.condition || ""}`;
      output += `${indent}${condStr} {\n${generateConfigString(node.children, depth + 1)}${indent}}\n`;
    } else if (node.type === "plugin") {
      output += `${indent}${node.name} {\n`;
      Object.entries(node.properties || {}).forEach(([key, val]: [string, any]) => {
        if (key === "match" && typeof val === "object") {
          output += `${indent}  match => {\n`;
          if (val.patterns.length > 1) {
            output += `${indent}    "${val.field}" => [\n`;
            val.patterns.forEach((p: string, index: number) => {
              const comma = index === val.patterns.length - 1 ? "" : ",";
              output += `${indent}      "${p}"${comma}\n`;
            });
            output += `${indent}    ]\n`;
          } else {
            output += `${indent}    "${val.field}" => "${val.patterns[0] || ""}"\n`;
          }
          output += `${indent}  }\n`;
        } else {
          output += `${indent}  ${key} => ${val}\n`;
        }
      });
      output += `${indent}}\n`;
    }
  });
  return output;
};

// --- CONFIG PARSER (FIXED) ---
const parseLogstashConfig = (configStr: string) => {
  const cleanStr = configStr.replace(/\r\n/g, '\n');
  let index = 0;
  const length = cleanStr.length;

  const nodes = [
    { id: 'root-input', type: 'section', name: 'input', children: [], isRoot: true, enabled: true },
    { id: 'root-filter', type: 'section', name: 'filter', children: [], isRoot: true, enabled: true },
    { id: 'root-output', type: 'section', name: 'output', children: [], isRoot: true, enabled: true },
  ];

  const skipWhitespace = () => {
    while (index < length && /\s/.test(cleanStr[index])) index++;
  };

  const readToken = () => {
    skipWhitespace();
    if (index >= length) return null;
    
    if (cleanStr[index] === '#') {
      let end = index;
      while(end < length && cleanStr[end] !== '\n') end++;
      const comment = cleanStr.substring(index, end).trim();
      index = end;
      return { type: 'comment', value: comment };
    }

    const start = index;
    const char = cleanStr[index];

    if (['{', '}', ',', '[', ']'].includes(char)) {
      index++;
      return char;
    }
    
    if (char === '=' && cleanStr[index+1] === '>') {
      index += 2;
      return '=>';
    }

    if (char === '"' || char === "'") {
       index++;
       while(index < length) {
           if (cleanStr[index] === '\\') { index += 2; continue; }
           if (cleanStr[index] === char) { break; }
           index++;
       }
       index++; 
       return cleanStr.substring(start + 1, index - 1); 
    }

    while(index < length && !/\s|{|}|,|\[|\]|#/.test(cleanStr[index]) && !(cleanStr[index] === '=' && cleanStr[index+1] === '>')) {
       index++;
    }
    return cleanStr.substring(start, index);
  };

  const parseValue = () => {
    skipWhitespace();
    const start = index;
    const firstChar = cleanStr[index];
    
    // 1. Quoted String
    if (firstChar === '"' || firstChar === "'") {
        const quote = firstChar;
        index++;
        while (index < length) {
            if (cleanStr[index] === '\\') { index += 2; continue; }
            if (cleanStr[index] === quote) { index++; break; }
            index++;
        }
        return cleanStr.substring(start, index);
    }
    
    // 2. Array or Hash (Balanced)
    if (firstChar === '[' || firstChar === '{') {
        const open = firstChar;
        const close = open === '[' ? ']' : '}';
        let depth = 1;
        index++;
        let inQuote = null;
        
        while(index < length && depth > 0) {
            const c = cleanStr[index];
            if (c === '\\') { index += 2; continue; }
            
            if (inQuote) {
                if (c === inQuote) inQuote = null;
            } else {
                if (c === '"' || c === "'") inQuote = c;
                else if (c === open) depth++;
                else if (c === close) depth--;
            }
            index++;
        }
        return cleanStr.substring(start, index);
    }
    
    // 3. Bareword / Scalar
    while(index < length) {
        const c = cleanStr[index];
        if (/\s/.test(c) || c === '}' || c === ']' || c === '#') break;
        index++;
    }
    return cleanStr.substring(start, index).trim();
  };

  const parseCondition = () => {
    skipWhitespace();
    const start = index;
    let inRegex = false;
    let inQuote = null;
    let bracketDepth = 0;

    while(index < length) {
        const char = cleanStr[index];
        if (char === '\\') { index += 2; continue; }

        if (inRegex) {
            if (char === '/') inRegex = false;
        } else if (inQuote) {
            if (char === inQuote) inQuote = null;
        } else {
            if (char === '"' || char === "'") {
                inQuote = char;
            } else if (char === '/' && bracketDepth === 0) {
                inRegex = true;
            } else if (char === '[') {
                bracketDepth++;
            } else if (char === ']') {
                bracketDepth--;
            } else if (char === '{') {
                if (bracketDepth === 0) break;
            }
        }
        index++;
    }
    return cleanStr.substring(start, index).trim();
  };

  const parseGrokMatch = (valStr: string) => {
     try {
       if (!valStr.trim().startsWith('{')) return valStr;
       // Updated regex to handle both double and single quotes for field names
       const fieldMatch = valStr.match(/(["'])([^"']+)\1\s*=>/);
       if (!fieldMatch) return valStr;
       const field = fieldMatch[2]; // Capture group 2 is the content inside quotes
       const patterns: string[] = [];
       const patternRegex = /"(.*?)(?<!\\)"/g;
       let match;
       let count = 0;
       while ((match = patternRegex.exec(valStr)) !== null) {
          if (count > 0) patterns.push(match[1]);
          count++;
       }
       return { field, patterns };
     } catch (e) { return valStr; }
  };

  const parseBlock = (containerList: any[]) => {
     while (index < length) {
        const tokenVal = readToken();
        if (!tokenVal) return;
        
        if (typeof tokenVal === 'object' && tokenVal.type === 'comment') {
            containerList.push({
                id: generateId(),
                type: 'comment',
                text: tokenVal.value.replace(/^#\s*/, ''),
                name: 'Comment'
            });
            continue;
        }

        const token = tokenVal as string;
        if (token === '}') return;

        if (['input', 'filter', 'output'].includes(token)) {
           const next = readToken();
           if (next === '{') {
              const root = nodes.find(n => n.name === token);
              if (root) parseBlock(root.children);
           }
        } else if (token === 'if' || token === 'else') {
           let name = token;
           let condition = '';
           
           if (name === 'else') {
              skipWhitespace();
              if (cleanStr.substr(index, 2) === 'if' && /\s/.test(cleanStr[index+2])) {
                 index += 2;
                 name = 'else if';
                 condition = parseCondition();
              }
           } else {
              condition = parseCondition();
           }

           readToken(); 
           
           const newNode: any = {
              id: generateId(),
              type: 'conditional',
              name,
              condition,
              children: []
           };
           containerList.push(newNode);
           parseBlock(newNode.children);

        } else {
           const name = token;
           const next = readToken();
           if (next === '{') {
              const props: any = {};
              while(index < length) {
                 const keyToken = readToken();
                 if (!keyToken || keyToken === '}') break;
                 if (typeof keyToken === 'object') continue;
                 
                 const key = keyToken as string;
                 const arrow = readToken();
                  if (arrow === '=>') {
                    let val: any = parseValue();
                    if (name === 'grok' && key === 'match') val = parseGrokMatch(val);
                    (props as any)[key] = val;
                  }
              }

              let category = 'filter'; 
              if (PLUGIN_DEFINITIONS?.input?.[name]) category = 'input';
              else if (PLUGIN_DEFINITIONS?.output?.[name]) category = 'output';

              containerList.push({
                 id: generateId(),
                 type: 'plugin',
                 name, 
                 category, 
                 properties: props
              });
           }
        }
     }
  };

  while(index < length) {
      const tokenVal = readToken();
      if (!tokenVal) break;
      if (typeof tokenVal === 'object') continue;
      
      const token = tokenVal as string;
      if (['input', 'filter', 'output'].includes(token)) {
           const next = readToken();
           if (next === '{') {
              const root = nodes.find(n => n.name === token);
              if (root) parseBlock(root.children);
           }
      }
  }

  return nodes;
};

const analyzeDependencies = (nodes: any[]) => {
  const fieldMap: any = {}; 

  const cleanFieldName = (f: string) => {
    if (!f) return null;
    // Safer quote removal: matches start quote OR end quote
    let clean = f.replace(/^["']|["']$/g, '').trim();
    // Normalize [field] to field for consistency (matches top-level refs), 
    // but keep [nested][field] as is.
    if (clean.startsWith('[') && clean.endsWith(']') && clean.indexOf('][') === -1) {
       clean = clean.substring(1, clean.length - 1);
    }
    return clean;
  };

  const register = (field: string, nodeId: string, type: 'producers' | 'consumers') => {
    const clean = cleanFieldName(field);
    if (!clean) return;
    if (!fieldMap[clean]) fieldMap[clean] = { producers: [], consumers: [] };
    if (!fieldMap[clean][type].includes(nodeId)) fieldMap[clean][type].push(nodeId);
  };

  const findInterpolatedFields = (str: string, nodeId: string) => {
    if (typeof str !== 'string') return;
    const regex = /%\{([a-zA-Z0-9_@\-\[\]]+)\}/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (!match[1].startsWith('+')) { 
        register(match[1], nodeId, 'consumers');
      }
    }
  };

  // Recursive scanner for field references in properties (strings, arrays, objects)
  const scanForFieldRefs = (val: any, nodeId: string) => {
      if (typeof val === 'string') {
          // 1. Interpolated fields: %{field}
          findInterpolatedFields(val, nodeId);
          
          // 2. Bracketed field references: [field] or [nested][field]
          // Matches one or more groups of [chars]
          const bracketRegex = /((?:\[[a-zA-Z0-9_@\-\.]+\s*\])+)/g;
          let match;
          while ((match = bracketRegex.exec(val)) !== null) {
              register(match[1], nodeId, 'consumers');
          }
      } else if (Array.isArray(val)) {
          val.forEach(v => scanForFieldRefs(v, nodeId));
      } else if (typeof val === 'object' && val !== null) {
          Object.values(val).forEach(v => scanForFieldRefs(v, nodeId));
      }
  };

  const traverse = (list: any[]) => {
    list.forEach(node => {
      if (node.category === 'input') {
        register('message', node.id, 'producers');
        register('@timestamp', node.id, 'producers');
        register('host', node.id, 'producers');
      }
      if (node.type === 'conditional' && node.condition) {
        // Capture full nested fields like [a][b] or single fields like [a]
        const condRegex = /((?:\[[^\]]+\])+)/g;
        let match;
        while ((match = condRegex.exec(node.condition)) !== null) {
          register(match[1], node.id, 'consumers');
        }
      }
      if (node.properties) {
        if (node.properties.add_field) {
           const addFieldStr = node.properties.add_field;
           const fieldRegex = /"([a-zA-Z0-9_@\-\[\]]+)"\s*=>/g;
           let keyMatch;
           while ((keyMatch = fieldRegex.exec(addFieldStr)) !== null) {
              register(keyMatch[1], node.id, 'producers');
           }
        }

        // Use the recursive scanner for all properties to catch nested/deep refs
        Object.entries(node.properties).forEach(([key, val]: [string, any]) => {
           if (node.name === 'dissect' && key === 'mapping') return;
           scanForFieldRefs(val, node.id);
        });

        if (node.properties.target) register(node.properties.target, node.id, 'producers');
        if (node.properties.source) register(node.properties.source, node.id, 'consumers');

        if (node.name === 'grok' && node.properties.match && typeof node.properties.match === 'object') {
            if (node.properties.match.field) {
                register(node.properties.match.field, node.id, 'consumers');
            }
            const patterns = node.properties.match.patterns || [];
            patterns.forEach((pat: string) => {
               const regexStandard = /%\{[A-Z0-9_]+:([a-zA-Z0-9_@\[\]]+)(?::[a-zA-Z]+)?\}/g;
               let match;
               while ((match = regexStandard.exec(pat)) !== null) {
                   register(match[1], node.id, 'producers');
               }
               const regexNamed = /\(\?<([a-zA-Z0-9_@\[\]]+)>/g;
               while ((match = regexNamed.exec(pat)) !== null) {
                   register(match[1], node.id, 'producers');
               }
            });
        }

        if (node.name === 'mutate') {
           if (node.properties.rename) {
              // Updated to include brackets [] in field names
              const renameRegex = /"([a-zA-Z0-9_@\-\[\]]+)"\s*=>\s*"([a-zA-Z0-9_@\-\[\]]+)"/g;
              let match;
              while ((match = renameRegex.exec(node.properties.rename)) !== null) {
                 register(match[1], node.id, 'consumers');
                 register(match[2], node.id, 'producers');
              }
           }
           if (node.properties.copy) {
              // Updated to include brackets [] in field names
              const copyRegex = /"([a-zA-Z0-9_@\-\[\]]+)"\s*=>\s*"([a-zA-Z0-9_@\-\[\]]+)"/g;
              let match;
              while ((match = copyRegex.exec(node.properties.copy)) !== null) {
                 register(match[1], node.id, 'consumers');
                 register(match[2], node.id, 'producers');
              }
           }
        }

        if (node.name === 'dissect' && node.properties.mapping) {
           const mappingStr = node.properties.mapping;
           const sourceRegex = /"([a-zA-Z0-9_@\-\[\]]+)"\s*=>/g;
           let sourceMatch;
           while ((sourceMatch = sourceRegex.exec(mappingStr)) !== null) {
               register(sourceMatch[1], node.id, 'consumers');
           }
           const targetRegex = /%\{([+]?)([a-zA-Z0-9_@\-\[\]]+)(?:[:}].*?)?\}/g; 
           let targetMatch;
           while ((targetMatch = targetRegex.exec(mappingStr)) !== null) {
               const modifier = targetMatch[1];
               const field = targetMatch[2];
               if (modifier !== '?') {
                   register(field, node.id, 'producers');
               }
           }
        }
      }
      if (node.children) traverse(node.children);
    });
  };
  traverse(nodes);
  return fieldMap;
};

// --- 3. Sub-Components ---

const PluginIcon = ({ name, className = "w-4 h-4" }: { name: string; className?: string }) => {
  if (['input', 'filter', 'output'].includes(name)) return <FolderOpen className={className} />;
  if (['if', 'else', 'else if'].includes(name)) return <ArrowRightFromLine className={className} />;
  if (name === 'Comment') return <MessageSquare className={className} />;
  return <Box className={className} />;
};

const ConnectionLines = ({ activeField, dependencies, containerRef }: any) => {
  const [dims, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDims = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.scrollWidth,
          height: containerRef.current.scrollHeight
        });
      }
    };

    updateDims();
    
    // Create a ResizeObserver to watch for content size changes
    const observer = new ResizeObserver(updateDims);
    observer.observe(containerRef.current);
    
    // Also listen for window resize events
    window.addEventListener('resize', updateDims);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDims);
    };
  }, [containerRef, dependencies, activeField]); // Recalculate if container, deps or active field changes

  if (!activeField || !dependencies[activeField]) return null;
  const { producers, consumers } = dependencies[activeField];
  
  const getAnchor = (id: string) => {
    const el = document.getElementById(`node-${id}`);
    if (!el || !containerRef.current) return null;
    
    const nodeRect = el.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    return { 
      x: nodeRect.left - containerRect.left + containerRef.current.scrollLeft, 
      y: nodeRect.top - containerRect.top + containerRef.current.scrollTop + (nodeRect.height / 2) 
    };
  };

  const lines: any[] = [];
  
  let minX = Infinity;
  const allNodes = [...producers, ...consumers];
  allNodes.forEach((id: string) => {
      const pos = getAnchor(id);
      if (pos && pos.x < minX) minX = pos.x;
  });
  
  if (minX === Infinity) return null;

  const busX = Math.max(10, minX - 30); 

  producers.forEach((pid: string) => {
    const start = getAnchor(pid);
    if(!start) return;

    const targets = consumers
      .map((cid: string) => ({ id: cid, pos: getAnchor(cid) }))
      .filter((t: any) => t.pos && t.pos.y !== start.y)
      .sort((a: any, b: any) => a.pos.y - b.pos.y);

    if (targets.length === 0) return;

    lines.push(
        <path key={`producer-leg-${pid}`} d={`M ${start.x} ${start.y} H ${busX}`} fill="none" stroke="#6366f1" strokeWidth="2" className="animate-draw" />
    );

    const minY = Math.min(start.y, targets[0].pos.y);
    const maxY = Math.max(start.y, targets[targets.length - 1].pos.y);
    
    lines.push(
        <path key={`bus-vertical-${pid}`} d={`M ${busX} ${minY} V ${maxY}`} fill="none" stroke="#6366f1" strokeWidth="2" className="animate-draw" />
    );

    targets.forEach((t: any) => {
        lines.push(
            <path key={`consumer-leg-${pid}-${t.id}`} d={`M ${busX} ${t.pos.y} H ${t.pos.x - 6}`} fill="none" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" style={{ strokeDasharray: '4,4' }} />
        );
        lines.push(
            <circle key={`joint-${pid}-${t.id}`} cx={busX} cy={t.pos.y} r="2" fill="#6366f1" />
        );
    });

    lines.push(
        <circle key={`start-dot-${pid}`} cx={start.x} cy={start.y} r="3" fill="#10b981" />
    );
  });

  return (
    <svg 
      className="absolute top-0 left-0 pointer-events-none z-50"
      style={{ width: dims.width, height: dims.height }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
        </marker>
        <style>{`@keyframes draw { from { stroke-dasharray: 0, 1000; } to { stroke-dasharray: 1000, 0; } }`}</style>
      </defs>
      {lines}
    </svg>
  );
};

const PipelineNode = ({ node, selectedId, onSelect, onDrop, onDragStart, onDragOverNode, dropTarget, depth = 0, activeField, dependencies, wordWrap, onRequestDelete }: any) => {
  const isSelected = selectedId === node.id;
  const isSection = node.type === 'section';
  const isConditional = node.type === 'conditional';
  const isContainer = isSection || isConditional;
  const isDisabled = node.isRoot && node.enabled === false;
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const isDropTarget = dropTarget && dropTarget.id === node.id;
  const dropPos = isDropTarget ? dropTarget.pos : null;

  let borderColor = 'border-slate-800';
  let bgColor = 'bg-slate-900';
  let shadowClass = '';
  let textColor = 'text-slate-300';

  if (isSelected) {
    borderColor = 'border-sky-500';
    bgColor = 'bg-slate-800';
    textColor = 'text-white';
  } else if (isSection) {
    bgColor = 'bg-slate-900/50';
  } else if (node.type === 'comment') {
    bgColor = 'bg-slate-800/30';
    borderColor = 'border-transparent';
    textColor = 'text-slate-500 italic';
  }

  if (isDisabled) {
    borderColor = 'border-slate-800 border-dashed';
    bgColor = 'bg-slate-900/20';
    textColor = 'text-slate-600';
  }

  if (!isDisabled && activeField && dependencies && dependencies[activeField]) {
      const { producers, consumers } = dependencies[activeField];
      
      if (consumers.includes(node.id)) {
          borderColor = 'border-indigo-500';
          bgColor = 'bg-indigo-900/20';
          shadowClass = 'shadow-[0_0_15px_rgba(99,102,241,0.3)]';
      } else if (producers.includes(node.id)) {
          borderColor = 'border-emerald-500';
          bgColor = 'bg-emerald-900/20';
          shadowClass = 'shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      } else if (!node.isRoot) {
          // Dim non-correlated nodes using transparent background + darker text, NO opacity-40
          bgColor = 'bg-slate-950/50';
          borderColor = 'border-slate-800/50';
          textColor = 'text-slate-600';
      }
  }

  if (dropPos === 'inside') {
    borderColor = 'border-sky-400';
    bgColor = 'bg-sky-900/30';
    shadowClass = '';
  }

  let iconColor = 'text-slate-400';
  if (node.name === 'input') iconColor = 'text-purple-400';
  if (node.name === 'filter') iconColor = 'text-blue-400';
  if (node.name === 'output') iconColor = 'text-orange-400';

  if (isDisabled) iconColor = 'text-slate-600';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!nodeRef.current) return;
    
    const rect = nodeRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const height = rect.height;
    
    let pos = 'inside'; 

    if (node.isRoot) {
      pos = 'inside';
    } else if (isContainer) {
      if (offsetY < height * 0.2) pos = 'top';
      else if (offsetY > height * 0.8) pos = 'bottom';
      else pos = 'inside';
    } else {
      if (offsetY < height * 0.5) pos = 'top';
      else pos = 'bottom';
    }

    onDragOverNode(node.id, pos);
  };

  const handleDropLocal = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(e, node.id); 
  };

  return (
    <div 
      ref={nodeRef}
      id={`node-${node.id}`}
      className={`relative mb-2 rounded border ${borderColor} ${bgColor} ${shadowClass} transition-all duration-200 ${isDisabled ? 'opacity-60' : ''}`}
      style={{ marginLeft: `${depth * 12}px` }}
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
      draggable={!node.isRoot}
      onDragStart={(e) => onDragStart(e, node, node.id)}
      onDragOver={handleDragOver}
      onDrop={handleDropLocal}
    >
      {dropPos === 'top' && (
        <div className="absolute -top-1.5 left-0 right-0 h-1 bg-sky-500 rounded z-50 pointer-events-none shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
      )}

      {!node.isRoot && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRequestDelete(node.id)
          }}
          className="absolute top-2 right-2 w-5 h-5 bg-red-900/50 hover:bg-red-900 border border-red-700 hover:border-red-500 rounded flex items-center justify-center transition-colors z-10 group"
          title="Delete Block"
        >
          <Trash2 className="w-3 h-3 text-red-400 group-hover:text-red-200" />
        </button>
      )}

      <div className={`flex items-center gap-2 p-2 ${isContainer ? 'border-b border-slate-800' : ''}`}>
        {!isSection && <GripVertical className="w-3 h-3 text-slate-600 cursor-grab" />}
        <PluginIcon name={node.name} className={`${iconColor}`} />
        <span className={`text-sm font-mono font-bold ${textColor}`}>
          {node.type === 'comment' ? (
              <span className="truncate max-w-[500px]">{node.text}</span>
          ) : (
             <>
                {node.name} {isDisabled && '(Disabled)'}
                {node.condition && (
                  <span className={`ml-2 text-xs font-mono text-yellow-500 ${wordWrap ? 'whitespace-normal' : 'truncate max-w-[200px]'}`}>
                    {node.condition}
                  </span>
                )}
             </>
          )}
        </span>
        
        {isSection && !isDisabled && <span className="text-xs text-slate-600">{'{'}</span>}
      </div>

      {(isContainer || node.children) && !isDisabled && (
        <div className={`p-2 min-h-[40px] ${node.children.length === 0 ? 'bg-slate-800/20' : ''}`}>
           {node.children.length === 0 && (
             <div className="h-12 border border-dashed border-slate-800 rounded flex items-center justify-center text-xs text-slate-600 italic pointer-events-none">
               {dropPos === 'inside' ? 'Drop to Insert' : 'Drag items here'}
             </div>
           )}
           {node.children.map((child: any) => (
             <PipelineNode 
               key={child.id} 
               node={child} 
               selectedId={selectedId} 
               onSelect={onSelect} 
               onDrop={onDrop}
               onDragStart={onDragStart}
               onDragOverNode={onDragOverNode}
               dropTarget={dropTarget}
               depth={depth + 1} 
               activeField={activeField}
               dependencies={dependencies}
               wordWrap={wordWrap}
               onRequestDelete={onRequestDelete}
             />
           ))}
        </div>
      )}
      
      {isSection && !isDisabled && <div className="px-2 pb-1 text-xs text-slate-600">{'}'}</div>}
      {isDisabled && (
         <div className="p-4 flex items-center justify-center text-xs text-slate-600 italic border-t border-slate-800/50">
            Drag a plugin here to restore this block
         </div>
      )}

      {node.type === 'plugin' && (
        <div className="px-3 pb-2 space-y-0.5">
          {Object.entries(node.properties || {}).slice(0, 3).map(([k, v]: [string, any]) => (
             <div key={k} className="text-[10px] flex gap-2 font-mono">
               <span className="text-slate-500 shrink-0">{k}:</span>
               <span className={`text-green-400/80 ${wordWrap ? 'whitespace-normal break-all' : 'truncate'}`}>
                 {typeof v === 'object' ? JSON.stringify(v) : v}
               </span>
             </div>
          ))}
        </div>
      )}

      {dropPos === 'bottom' && (
        <div className="absolute -bottom-1.5 left-0 right-0 h-1 bg-sky-500 rounded z-50 pointer-events-none shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
      )}
    </div>
  );
};

// --- 4. Main Application ---

export default function LogstashBuilder() {
  const [nodes, setNodes] = useState(INITIAL_STATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [dropTarget, setDropTarget] = useState<any>(null);
  const [expandedProp, setExpandedProp] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openSections, setOpenSections] = useState<any>({
    input: false, filter: false, output: false, logic: false, comment: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    const res = findNode(nodes, selectedId);
    return res ? res.node : null;
  }, [nodes, selectedId]);

  const dependencies = useMemo(() => analyzeDependencies(nodes), [nodes]);

  // Reset highlight index when active field changes
  useEffect(() => {
    setHighlightIndex(0);
  }, [activeField]);

  const filteredLibraryItems = useMemo(() => {
    if (!searchQuery) return LIBRARY_ITEMS;
    const lowerQuery = searchQuery.toLowerCase();
    return LIBRARY_ITEMS.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.toLowerCase().includes(lowerQuery))
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const toggleSection = (category: string) => setOpenSections((prev: any) => ({ ...prev, [category]: !prev[category] }));
  const expandAll = () => setOpenSections({ input: true, filter: true, output: true, logic: true, comment: true });
  const collapseAll = () => setOpenSections({ input: false, filter: false, output: false, logic: false, comment: false });

  const getSortedCorrelatedIds = (fieldName: string) => {
      if (!dependencies[fieldName]) return [];
      const dep = dependencies[fieldName];
      const relevantIds = new Set([...dep.producers, ...dep.consumers]);
      const sortedIds: string[] = [];
      const traverse = (nList: any[]) => {
          nList.forEach(node => {
              if (relevantIds.has(node.id)) sortedIds.push(node.id);
              if (node.children) traverse(node.children);
          });
      }
      traverse(nodes);
      return sortedIds;
  };

  const handleNavigate = (direction: 'next' | 'prev') => {
      if (!activeField) return;
      const sortedIds = getSortedCorrelatedIds(activeField);
      if (sortedIds.length === 0) return;

      let newIndex = direction === 'next' ? highlightIndex + 1 : highlightIndex - 1;
      if (newIndex >= sortedIds.length) newIndex = 0;
      if (newIndex < 0) newIndex = sortedIds.length - 1;

      setHighlightIndex(newIndex);
      
      const targetId = sortedIds[newIndex];
      const el = document.getElementById(`node-${targetId}`);
      if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const newNodes = parseLogstashConfig(text);
        if (newNodes && newNodes.length > 0) {
           setNodes(newNodes);
           setSelectedId(null);
           setErrorToast(null);
        } else {
           setErrorToast("Failed to parse config file: No valid sections found.");
           setTimeout(() => setErrorToast(null), 3000);
        }
      } catch (err: any) {
        console.error(err);
        setErrorToast("Error reading file: " + err.message);
        setTimeout(() => setErrorToast(null), 3000);
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = ''; 
  };

  const handleDoubleClick = (item: string, category: string) => {
    let targetSectionId = '';
    if (category === 'input') targetSectionId = 'root-input';
    else if (category === 'output') targetSectionId = 'root-output';
    else targetSectionId = 'root-filter'; 

    const defs = PLUGIN_DEFINITIONS[category]?.[item] || {};
    const required = REQUIRED_FIELDS[category]?.[item] || [];
    const initialProps: any = {};

    required.forEach((reqKey: string) => {
        if (defs[reqKey]) initialProps[reqKey] = defs[reqKey];
        if (reqKey === 'match' && defs.match) initialProps.match = defs.match;
    });

    const nodeToInsert = {
      id: generateId(),
      type: ['if', 'else', 'else if'].includes(item) ? 'conditional' : category === 'comment' ? 'comment' : 'plugin',
      name: item,
      category: category,
      properties: initialProps,
      children: category === 'logic' ? [] : undefined
    };

    const newNodes = JSON.parse(JSON.stringify(nodes));
    const targetSection = newNodes.find((n: any) => n.id === targetSectionId);
    
    if (targetSection) {
      if (targetSection.enabled === false) targetSection.enabled = true;
      targetSection.children.push(nodeToInsert);
      setNodes(newNodes);
      setSelectedId(nodeToInsert.id);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: any, existingId: string | null = null) => {
    e.stopPropagation();
    const payload = existingId ? { type: 'MOVE', id: item.id } : { type: 'NEW', ...item };
    setDraggedItem(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverNode = (id: string, pos: string) => {
     if (!dropTarget || dropTarget.id !== id || dropTarget.pos !== pos) setDropTarget({ id, pos });
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTarget = dropTarget; 
    setDropTarget(null);

    if (!draggedItem || !currentTarget) return;

    const { id: targetId, pos: dropPos } = currentTarget;
    if (draggedItem.type === 'MOVE' && draggedItem.id === targetId) return;

    try {
      const targetRes = findNode(nodes, targetId);
      if (!targetRes) return;
      const { node: targetNode } = targetRes;
      const rootSection = getRootSectionName(nodes, targetId) || targetNode.name; 
      
      let itemCategory = draggedItem.type === 'NEW' ? draggedItem.category : null;
      if (draggedItem.type === 'MOVE') {
        const movedNodeRes = findNode(nodes, draggedItem.id);
        if (movedNodeRes) itemCategory = movedNodeRes.node.category;
      }

      const isPlugin = ['input', 'filter', 'output'].includes(itemCategory);
      if (isPlugin && rootSection && itemCategory !== rootSection) {
         setErrorToast(`Error: Cannot place ${itemCategory.toUpperCase()} plugin into ${rootSection.toUpperCase()} section.`);
         setTimeout(() => setErrorToast(null), 3000);
         return;
      }

      const newNodes = JSON.parse(JSON.stringify(nodes));
      let nodeToInsert: any = null;

      if (draggedItem.type === 'NEW') {
        const defs = PLUGIN_DEFINITIONS[draggedItem.category]?.[draggedItem.name] || {};
        const required = REQUIRED_FIELDS[draggedItem.category]?.[draggedItem.name] || [];
        const initialProps: any = {};
        required.forEach((reqKey: string) => {
            if (defs[reqKey]) initialProps[reqKey] = defs[reqKey];
            if (reqKey === 'match' && defs.match) initialProps.match = defs.match;
        });

        nodeToInsert = {
          id: generateId(),
          type: ['if', 'else', 'else if'].includes(draggedItem.name) ? 'conditional' : draggedItem.category === 'comment' ? 'comment' : 'plugin',
          name: draggedItem.name,
          category: draggedItem.category, // FIXED: was causing ReferenceError if accidentally set to 'category'
          properties: initialProps,
          children: draggedItem.category === 'logic' ? [] : undefined
        };
      } else {
        const removeRecursive = (list: any[]): any => {
           const idx = list.findIndex(n => n.id === draggedItem.id);
           if (idx !== -1) return list.splice(idx, 1)[0];
           for (let n of list) {
             if (n.children) {
               const removed = removeRecursive(n.children);
               if (removed) return removed;
             }
           }
           return null;
        };
        nodeToInsert = removeRecursive(newNodes);
      }

      if (!nodeToInsert) return;

      const insertRecursive = (list: any[]): boolean => {
        for (let i = 0; i < list.length; i++) {
          const n = list[i];
          if (n.id === targetId) {
             if (n.isRoot && n.enabled === false) n.enabled = true;
             
             if (dropPos === 'inside') {
                if (n.children) {
                  n.children.push(nodeToInsert);
                  return true;
                }
                list.splice(i + 1, 0, nodeToInsert);
                return true;
             } else if (dropPos === 'top') {
                list.splice(i, 0, nodeToInsert);
                return true;
             } else if (dropPos === 'bottom') {
                list.splice(i + 1, 0, nodeToInsert);
                return true;
             }
          }
          if (n.children && insertRecursive(n.children)) return true;
        }
        return false;
      };
      
      insertRecursive(newNodes);
      setNodes(newNodes);
      setSelectedId(nodeToInsert.id);
    } catch (err) { console.error(err); }
    setDraggedItem(null);
  };

  const handleUpdateProp = (key: string, val: any, replaceAll = false) => {
    if (!selectedNode) return;
    const newNodes = JSON.parse(JSON.stringify(nodes));
    const { node } = findNode(newNodes, selectedId!);
    
    if (key === 'condition' || key === 'text') {
      node[key] = val;
    } else {
      if (replaceAll) node.properties = val;
      else node.properties = { ...node.properties, [key]: val };
    }
    setNodes(newNodes);
  };

  const handleRequestDelete = (nodeId: string | null = null) => {
    const idToDelete = nodeId || selectedId;
    if (!idToDelete) return;

    // Check if dirty
    const { node: nodeToCheck } = findNode(nodes, idToDelete) || {};
    if (!nodeToCheck) return;

    // Special logic for root
    if (nodeToCheck.isRoot) {
       if (nodeToCheck.children && nodeToCheck.children.length > 0) {
           setNodeToDelete(idToDelete);
           setShowDeleteConfirm(true);
           return;
       } else {
           performDelete(idToDelete);
           return;
       }
    }

    let isDirty = false;
    if (nodeToCheck.children && nodeToCheck.children.length > 0) isDirty = true;
    else if (nodeToCheck.type === 'comment' && nodeToCheck.text && nodeToCheck.text.length > 0) isDirty = true;
    else if (nodeToCheck.type === 'plugin') {
        const defs = PLUGIN_DEFINITIONS[nodeToCheck.category]?.[nodeToCheck.name] || {};
        const required = REQUIRED_FIELDS[nodeToCheck.category]?.[nodeToCheck.name] || [];
        const initialProps: any = {};
        required.forEach((reqKey: string) => {
            if (defs[reqKey]) initialProps[reqKey] = defs[reqKey];
            if (reqKey === 'match' && defs.match) initialProps.match = defs.match;
        });
        if (JSON.stringify(nodeToCheck.properties) !== JSON.stringify(initialProps)) isDirty = true;
    }

    if (isDirty) {
        setNodeToDelete(idToDelete);
        setShowDeleteConfirm(true);
    } else {
        performDelete(idToDelete);
    }
  };

  const performDelete = (idToDelete: string | null) => {
    if (!idToDelete) return;
    const newNodes = JSON.parse(JSON.stringify(nodes));
    const removeRecursive = (list: any[]): boolean => {
       const idx = list.findIndex(n => n.id === idToDelete);
       if (idx !== -1) {
         if (list[idx].isRoot) {
             list[idx].enabled = false;
             list[idx].children = [];
             return true;
         }
         list.splice(idx, 1);
         return true;
       }
       for (let n of list) {
         if (n.children && removeRecursive(n.children)) return true;
       }
       return false;
    };
    removeRecursive(newNodes);
    setNodes(newNodes);
    setSelectedId(null);
    setNodeToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleExport = () => {
    const config = generateConfigString(nodes);
    const blob = new Blob([config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline.conf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const config = generateConfigString(nodes);
    const textArea = document.createElement("textarea");
    textArea.value = config;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { console.error('Failed to copy', err); }
    document.body.removeChild(textArea);
  };

  const renderPropertiesPanel = () => {
     if(!selectedNode) return null;
     const defaultDefs = PLUGIN_DEFINITIONS[selectedNode.category]?.[selectedNode.name] || {};
     const currentProps = selectedNode.properties || {};
     const category = selectedNode.category;
     
     const allKeys = Array.from(new Set([...Object.keys(defaultDefs), ...Object.keys(currentProps)])).sort();
     const commonKeys = COMMON_KEYS[category] || [];
     const specificKeys = allKeys.filter(k => !commonKeys.includes(k));
     specificKeys.sort();
     const activeCommonKeys = commonKeys; 

     const renderField = (key: string, isCommon = false) => {
        const isMatch = (key === 'match' && selectedNode.name === 'grok');
        const isActive = currentProps.hasOwnProperty(key);
        let val = isActive ? currentProps[key] : (defaultDefs[key] !== undefined ? defaultDefs[key] : COMMON_DEFS[key]);
        const opacityClass = isActive ? 'opacity-100' : 'opacity-50';
        const inputDisabled = !isActive;

        return (
          <div key={key} className="group transition-all duration-200 mb-4">
             <div className="flex justify-between items-center mb-1">
               <label className={`text-xs text-slate-500 font-bold uppercase ${opacityClass}`}>{key}</label>
               <div className="flex gap-1">
                  {!isActive && (
                    <button 
                      onClick={() => handleUpdateProp(key, val)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded"
                      title="Add to Config"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                  {isActive && (
                    <button 
                      onClick={() => {
                        const newProps = {...selectedNode.properties};
                        delete newProps[key];
                        handleUpdateProp('properties', newProps, true);
                      }}
                      className="text-red-500 hover:text-red-400 p-0.5"
                      title="Remove from Config"
                    >
                      <MinusCircle className="w-3 h-3" />
                    </button>
                  )}
               </div>
             </div>

             <div className={opacityClass}>
                 {isMatch ? (
                   <div className={`space-y-2 bg-slate-800/50 p-2 rounded border ${isActive ? 'border-slate-700' : 'border-slate-800'}`}>
                      <div>
                        <label className="text-[10px] text-sky-400 font-bold">Field</label>
                        <input 
                           className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-green-300 font-mono mt-0.5 disabled:cursor-not-allowed"
                           value={val?.field || ''}
                           disabled={inputDisabled}
                           onChange={(e) => handleUpdateProp('match', { ...val, field: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-amber-400 font-bold">Patterns</label>
                            {isActive && (
                              <button 
                                onClick={() => handleUpdateProp('match', { ...val, patterns: [...(val.patterns || []), ''] })}
                                className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-1.5 py-0.5 rounded"
                              >
                                + Add
                              </button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {(val?.patterns || []).map((pat: string, idx: number) => (
                                <div key={idx} className="flex gap-1 items-center">
                                   <div className="relative flex-1">
                                      <input 
                                          className="w-full bg-slate-800 border border-slate-700 rounded pl-2 pr-7 py-1 text-xs text-slate-300 font-mono disabled:cursor-not-allowed"
                                          value={pat}
                                          disabled={inputDisabled}
                                          onChange={(e) => {
                                              const newPats = [...val.patterns];
                                              newPats[idx] = e.target.value;
                                              handleUpdateProp('match', { ...val, patterns: newPats });
                                          }}
                                      />
                                      {isActive && (
                                        <button 
                                          onClick={() => setExpandedProp({
                                              title: `Grok Pattern #${idx+1}`,
                                              value: pat,
                                              onSave: (newVal: string) => {
                                                  const newPats = [...val.patterns];
                                                  newPats[idx] = newVal;
                                                  handleUpdateProp('match', { ...val, patterns: newPats });
                                              }
                                          })} 
                                          className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                        >
                                          <Maximize2 className="w-3 h-3" />
                                        </button>
                                      )}
                                   </div>
                                   {isActive && (
                                     <button 
                                        onClick={() => {
                                            if(val.patterns.length > 1) {
                                                const newPats = val.patterns.filter((_: any, i: number) => i !== idx);
                                                handleUpdateProp('match', { ...val, patterns: newPats });
                                            }
                                        }}
                                        className={`text-slate-600 ${val.patterns.length > 1 ? 'hover:text-red-400' : 'opacity-30 cursor-not-allowed'}`}
                                     >
                                        <MinusCircle className="w-3 h-3" />
                                     </button>
                                   )}
                                </div>
                            ))}
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="flex gap-1">
                     <input 
                       className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 font-mono focus:border-sky-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                       value={val || ''}
                       disabled={inputDisabled}
                       onChange={(e) => handleUpdateProp(key, e.target.value)}
                     />
                     {isActive && (
                       <button 
                         onClick={() => setExpandedProp({
                             title: key,
                             value: val || '',
                             onSave: (newVal: string) => handleUpdateProp(key, newVal)
                         })}
                         className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 px-2 rounded"
                       >
                         <Maximize2 className="w-3 h-3" />
                       </button>
                     )}
                   </div>
                 )}
             </div>
          </div>
        );
     };

     return (
       <div className="space-y-4">
         {specificKeys.map(key => renderField(key))}
         {activeCommonKeys.length > 0 && (
           <div className="pt-4 border-t border-slate-800 mt-4">
             <div className="text-xs text-slate-500 mb-4 font-bold uppercase flex items-center gap-2">
                <Settings className="w-3 h-3" /> Common Options
             </div>
             {activeCommonKeys.map(key => renderField(key, true))}
           </div>
         )}
         <div className="pt-4 border-t border-slate-800 mt-4">
           <div className="text-xs text-slate-500 mb-2 font-bold uppercase">Add Custom Property</div>
           <div className="flex gap-2">
             <input id="new-prop" placeholder="key_name" className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
             <button 
               onClick={() => {
                 const key = (document.getElementById('new-prop') as HTMLInputElement).value;
                 if(key && !currentProps[key]) {
                   handleUpdateProp(key, '""');
                   (document.getElementById('new-prop') as HTMLInputElement).value = '';
                 }
               }}
               className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 rounded"
             >
               <Plus className="w-4 h-4" />
             </button>
           </div>
         </div>
       </div>
     );
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans select-none">
      
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4" /> {errorToast}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-lg shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Modified Block?</h3>
            <p className="text-slate-400 mb-6 text-xs">This block has customizations that will be lost.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setNodeToDelete(null); }} className="px-4 py-2 text-slate-300 hover:text-white font-medium hover:bg-slate-800 rounded transition-colors text-xs">Cancel</button>
              <button onClick={() => performDelete(nodeToDelete)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg transition-colors flex items-center gap-2 text-xs"><Trash2 className="w-3 h-3" /> Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-lg shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reset Pipeline?</h3>
            <p className="text-slate-400 mb-6 text-sm">This will completely clear your current configuration. This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-slate-300 hover:text-white font-medium hover:bg-slate-800 rounded transition-colors">Cancel</button>
              <button onClick={() => { setNodes(JSON.parse(JSON.stringify(INITIAL_STATE))); setSelectedId(null); setActiveField(null); setShowResetConfirm(false); }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      {expandedProp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col h-[60vh]">
              <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
                 <span className="font-mono text-sm text-slate-300 font-bold uppercase">Editing: {expandedProp.title}</span>
                 <button onClick={() => setExpandedProp(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <textarea 
                 className={`flex-1 bg-black text-green-300 font-mono p-4 resize-none outline-none text-sm ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}
                 value={expandedProp.value}
                 onChange={(e) => setExpandedProp({ ...expandedProp, value: e.target.value })}
              />
              <div className="p-3 border-t border-slate-700 flex justify-end gap-2">
                 <button onClick={() => setExpandedProp(null)} className="px-4 py-1.5 rounded text-sm text-slate-400 hover:text-white">Cancel</button>
                 <button onClick={() => { expandedProp.onSave(expandedProp.value); setExpandedProp(null); }} className="bg-sky-600 text-white px-4 py-1.5 rounded text-sm hover:bg-sky-500 flex items-center gap-2"><Save className="w-3 h-3" /> Save Changes</button>
              </div>
           </div>
        </div>
      )}

      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-sky-500" /><h1 className="font-bold tracking-tight">LS Builder</h1></div>
          <div className="flex gap-1">
             <button onClick={expandAll} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Expand All"><ChevronsDown className="w-4 h-4" /></button>
             <button onClick={collapseAll} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Collapse All"><ChevronsUp className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="p-2 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
            <input type="text" placeholder="Search plugins..." className="w-full bg-slate-800/50 border border-slate-700 rounded pl-7 pr-7 py-1.5 text-xs text-slate-300 focus:border-sky-500 outline-none transition-colors" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X className="w-3 h-3" /></button>)}
          </div>
       </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {filteredLibraryItems.map((cat) => (
            <div key={cat.category}>
              <button onClick={() => toggleSection(cat.category)} className="flex items-center w-full text-left gap-1 text-xs font-bold text-slate-500 uppercase px-2 mb-2 hover:text-slate-300 transition-colors">
                 {(openSections[cat.category] || searchQuery) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                 {cat.label}
              </button>
              
              {(openSections[cat.category] || searchQuery) && (
                  <div className="space-y-1 pl-2 border-l border-slate-800 ml-2">
                    {cat.items.map(item => (
                      <div 
                        key={item}
                        draggable
                        onDragStart={(e) => handleDragStart(e, { name: item, category: cat.category })}
                        onDoubleClick={() => handleDoubleClick(item, cat.category)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 rounded cursor-grab active:cursor-grabbing text-sm border border-transparent hover:border-slate-600 transition-all select-none"
                      >
                        <PluginIcon name={item} className="w-4 h-4 text-slate-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative bg-[#0b1120]" id="canvas-area">
        
        <div className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between px-6 z-10">
          <div className="flex gap-2">
             <button onClick={() => { if (!showInsights) { setShowConfig(false); } else { setActiveField(null); } setShowInsights(!showInsights); }} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${showInsights ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'border-slate-700 text-slate-400 hover:text-slate-200'}`}><Share2 className="w-3 h-3" /> Insights</button>
             <button onClick={() => { if (!showConfig) { setShowInsights(false); setActiveField(null); } setShowConfig(!showConfig); }} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${showConfig ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-400 hover:text-slate-200'}`}><Code className="w-3 h-3" /> {showConfig ? 'Hide Config' : 'View Config'}</button>
             <button onClick={() => setWordWrap(!wordWrap)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${wordWrap ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-400 hover:text-slate-200'}`}><WrapText className="w-3 h-3" /> Wrap</button>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setShowResetConfirm(true)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors" title="Reset Configuration"><RotateCcw className="w-4 h-4" /></button>
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-xs font-bold shadow-lg shadow-indigo-500/20"><Upload className="w-3 h-3" /> Import</button>
             <input type="file" ref={fileInputRef} className="hidden" accept=".conf,.txt" onChange={handleImport} />
             <button onClick={handleExport} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-1.5 rounded text-xs font-bold shadow-lg shadow-sky-500/20"><Download className="w-3 h-3" /> Export</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 relative" ref={scrollContainerRef} onDragOver={(e) => { e.preventDefault(); setDropTarget(null); }}>
           {showInsights && <ConnectionLines activeField={activeField} dependencies={dependencies} containerRef={scrollContainerRef} />}
           {/* Trace Fields panel removed from here */}

           {showConfig ? (
             <div className="relative h-full">
               <button onClick={handleCopy} className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded shadow-lg z-10 transition-colors border border-slate-600" title="Copy to Clipboard">{copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
               <pre className={`font-mono text-xs text-green-400 bg-black/50 p-6 rounded border border-slate-800 h-full overflow-auto ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>{generateConfigString(nodes)}</pre>
             </div>
           ) : (
             <div className="max-w-3xl mx-auto space-y-6 pb-20">
               {nodes.map(section => (
                 <div key={section.id} onDragOver={(e) => { e.preventDefault(); }} onDrop={(e) => handleDrop(e, section.id)}>
                   <PipelineNode 
                     node={section} 
                     selectedId={selectedId} 
                     onSelect={setSelectedId} 
                     onDrop={handleDrop} 
                     onDragStart={handleDragStart} 
                     onDragOverNode={handleDragOverNode} 
                     dropTarget={dropTarget} 
                     activeField={showInsights ? activeField : null} 
                     dependencies={dependencies} 
                     wordWrap={wordWrap} 
                     onRequestDelete={handleRequestDelete}
                   />
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      <div className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col z-20">
        {showInsights ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-sky-500" /> Trace Fields</h2>
              {activeField && getSortedCorrelatedIds(activeField).length > 1 && (
                  <div className="flex items-center gap-1 bg-slate-800 rounded px-1">
                      <button type="button" onClick={() => handleNavigate('prev')} className="p-1 hover:text-white text-slate-400" title="Previous occurrence"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="text-[10px] font-mono text-slate-400 min-w-[30px] text-center">{highlightIndex + 1}/{getSortedCorrelatedIds(activeField).length}</span>
                      <button type="button" onClick={() => handleNavigate('next')} className="p-1 hover:text-white text-slate-400" title="Next occurrence"><ChevronRight className="w-4 h-4" /></button>
                  </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               {Object.keys(dependencies).length === 0 && <div className="text-xs text-slate-600 italic">No fields detected</div>}
               {Object.keys(dependencies)
                 .filter(field => {
                    const dep = dependencies[field];
                    const unique = new Set([...dep.producers, ...dep.consumers]);
                    return unique.size >= 2;
                 })
                 .sort().map(field => {
                   const dep = dependencies[field];
                   const count = new Set([...dep.producers, ...dep.consumers]).size;
                   
                   return (
                   <button key={field} onClick={() => setActiveField(activeField === field ? null : field)} className={`w-full text-left text-xs px-2 py-1 rounded mb-1 flex justify-between items-center ${activeField === field ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                     <span className="truncate mr-2">{field}</span>
                     <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-mono ${activeField === field ? 'text-sky-100' : 'text-slate-500'}`}>{count}</span>
                        {activeField === field && <Activity className="w-3 h-3" />}
                     </div>
                   </button>
                   );
                 })}
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-800"><h2 className="font-bold flex items-center gap-2"><Settings className="w-4 h-4 text-sky-500" /> Properties</h2></div>
            
            {selectedNode ? (
              <div className="flex-1 overflow-y-auto p-4">
                 <div className="mb-4">
                   <label className="text-xs text-slate-500 font-bold uppercase">Type</label>
                   <div className="text-sm font-mono text-sky-400">{selectedNode.name}</div>
                 </div>

                 {(selectedNode.type === 'conditional' || selectedNode.condition !== undefined) && (
                   <div className="mb-4">
                     <label className="text-xs text-slate-500 font-bold uppercase">Condition</label>
                     <div className="flex gap-1 mt-1">
                       <input className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-yellow-500 font-mono focus:border-sky-500 outline-none" value={selectedNode.condition || ''} onChange={(e) => handleUpdateProp('condition', e.target.value)} placeholder="[status] == 200" />
                       <button onClick={() => setExpandedProp({ title: 'Condition', value: selectedNode.condition || '', onSave: (val: string) => handleUpdateProp('condition', val) })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 px-2 rounded"><Maximize2 className="w-3 h-3" /></button>
                     </div>
                   </div>
                 )}

                 {selectedNode.type === 'comment' && (
                   <div className="mb-4">
                     <label className="text-xs text-slate-500 font-bold uppercase">Comment Text</label>
                     <div className="flex gap-1 mt-1">
                       <textarea className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:border-sky-500 outline-none h-20" value={selectedNode.text || ''} onChange={(e) => handleUpdateProp('text', e.target.value)} />
                       <button onClick={() => setExpandedProp({ title: 'Comment Text', value: selectedNode.text || '', onSave: (val: string) => handleUpdateProp('text', val) })} className="h-8 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 px-2 rounded"><Maximize2 className="w-3 h-3" /></button>
                     </div>
                   </div>
                 )}

                 {selectedNode.type === 'plugin' && selectedNode.properties && (renderPropertiesPanel())}

                 <button onClick={() => handleRequestDelete()} className="w-full mt-8 bg-red-900/30 border border-red-900 text-red-400 py-2 rounded text-sm hover:bg-red-900/50 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Delete Block</button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-center"><Settings className="w-12 h-12 mb-4 opacity-20" /><p className="text-sm">Select a block in the pipeline to edit properties.</p></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
