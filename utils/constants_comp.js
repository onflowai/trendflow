//const BASE_URL = 'http://localhost:5100/assets';
//const CAT_URL = 'http://localhost:5100/assets/cat';
const BASE_URL = '/assets';
const CAT_URL = '/assets/cat';
const BASE_URL_VALUE = '/assets'; //first "/" is required
const CAT_URL_VALUE = '/assets/cat'; //first "/" is required

// const BASE_URL = `${
//   process.env.NODE_ENV === 'production'
//     ? process.env.PROD_URL
//     : process.env.DEV_URL
// }/assets`;
// const CAT_URL = `${
//   process.env.NODE_ENV === 'production'
//     ? process.env.PROD_URL
//     : process.env.DEV_URL
// }/assets/cat`;

//CODE BELOW DATA:
// export const trendCategoryValues = Object.values(TREND_CATEGORY).map(
//   (category) => category.value
// ); // extracting values outside of the schema & validation
// export const technologiesValues = Object.values(TECHNOLOGIES).map(
//   (tech) => tech.value
// );

/**
 * GENERATIVE_AI: {
  value: `${CAT_URL_VALUE}/generative-ai.svg`,
  label: 'Generative AI',
  image: `${CAT_URL}/generative-ai.svg`,
},
NATURAL_LANGUAGE_PROCESSING: {
  value: `${CAT_URL_VALUE}/natural-language-processing.svg`,
  label: 'Natural Language Processing (NLP)',
  image: `${CAT_URL}/natural-language-processing.svg`,
},
COMPUTER_VISION: {
  value: `${CAT_URL_VALUE}/computer-vision.svg`,
  label: 'Computer Vision',
  image: `${CAT_URL}/computer-vision.svg`,
},
MACHINE_LEARNING: {
  value: `${CAT_URL_VALUE}/machine-learning.svg`,
  label: 'Machine Learning',
  image: `${CAT_URL}/machine-learning.svg`,
},
DEEP_LEARNING: {
  value: `${CAT_URL_VALUE}/deep-learning.svg`,
  label: 'Deep Learning',
  image: `${CAT_URL}/deep-learning.svg`,
},
EDGE_AI: {
  value: `${CAT_URL_VALUE}/edge-ai.svg`,
  label: 'Edge AI',
  image: `${CAT_URL}/edge-ai.svg`,
},
AI_SECURITY: {
  value: `${CAT_URL_VALUE}/ai-security.svg`,
  label: 'AI Security',
  image: `${CAT_URL}/ai-security.svg`,
},
AI_INFRASTRUCTURE: {
  value: `${CAT_URL_VALUE}/ai-infrastructure.svg`,
  label: 'AI Infrastructure',
  image: `${CAT_URL}/ai-infrastructure.svg`,
},
ROBOTICS_AI: {
  value: `${CAT_URL_VALUE}/robotics-ai.svg`,
  label: 'Robotics AI',
  image: `${CAT_URL}/robotics-ai.svg`,
},
AUTOMATED_MACHINE_LEARNING: {
  value: `${CAT_URL_VALUE}/automl.svg`,
  label: 'Automated Machine Learning (AutoML)',
  image: `${CAT_URL}/automl.svg`,
},
 */

/**
 * DOC USED FOR COMPARING SINCE CODE IS NOT COMMITTED
 * two data sets: TREND_CATEGORY & TECHNOLOGIES
 */
///////////////////////////////////////////////////////////////////////////////
export const TREND_CATEGORY = {
  API_DEVELOPMENT_TOOLS: {
    value: '`${CAT_URL_VALUE}/api-tools.svg`',
    label: 'API Development Tools',
    image: `${CAT_URL}/api-tools.svg`,
  },
  ARTIFICIAL_INTELLIGENCE: {
    value: `${CAT_URL_VALUE}/ai.svg`,
    label: 'Artificial Intelligence',
    image: `${CAT_URL}/ai.svg`,
  },
  AUGMENTED_REALITY: {
    value: `${CAT_URL_VALUE}/augmented-reality.svg`,
    label: 'Augmented Reality',
    image: `${CAT_URL}/augmented-reality.svg`,
  },
  BACKEND_DEVELOPMENT: {
    value: `${CAT_URL_VALUE}/backend-development.svg`,
    label: 'Backend Development',
    image: `${CAT_URL}/backend-development.svg`,
  },
  BACKEND_FRAMEWORK: {
    value: `${CAT_URL_VALUE}/backend-framework.svg`,
    label: 'Backend Framework',
    image: `${CAT_URL}/backend-framework.svg`,
  },
  BLOCKCHAIN: {
    value: `${CAT_URL_VALUE}/blockchain.svg`,
    label: 'Blockchain',
    image: `${CAT_URL}/blockchain.svg`,
  },
  CI_CD: {
    value: `${CAT_URL_VALUE}/ci-cd.svg`,
    label: 'CI/CD',
    image: `${CAT_URL}/ci-cd.svg`,
  },
  CLOUD_COMPUTING: {
    value: `${CAT_URL_VALUE}/cloud-computing.svg`,
    label: 'Cloud Computing',
    image: `${CAT_URL}/cloud-computing.svg`,
  },
  CLOUD_SERVICES: {
    value: `${CAT_URL_VALUE}/cloud-services.svg`,
    label: 'Cloud Services',
    image: `${CAT_URL}/cloud-services.svg`,
  },
  CONTAINERIZATION: {
    value: `${CAT_URL_VALUE}/containerization.svg`,
    label: 'Containerization',
    image: `${CAT_URL}/containerization.svg`,
  },
  CYBERSECURITY: {
    value: `${CAT_URL_VALUE}/cybersecurity.svg`,
    label: 'Cybersecurity',
    image: `${CAT_URL}/cybersecurity.svg`,
  },
  DATA_SCIENCE: {
    value: `${CAT_URL_VALUE}/data-science.svg`,
    label: 'Data Science',
    image: `${CAT_URL}/data-science.svg`,
  },
  DATABASE_TECHNOLOGIES: {
    value: `${CAT_URL_VALUE}/database-technologies.svg`,
    label: 'Database Technologies',
    image: `${CAT_URL}/database-technologies.svg`,
  },
  DEEP_LEARNING_AI: {
    value: `${CAT_URL_VALUE}/deep-learning-ai.svg`,
    label: 'Deep Learning AI',
    image: `${CAT_URL}/deep-learning-ai.svg`,
  },
  DEVOPS: {
    value: `${CAT_URL_VALUE}/devops.svg`,
    label: 'DevOps',
    image: `${CAT_URL}/devops.svg`,
  },
  EDGE_COMPUTING: {
    value: `${CAT_URL_VALUE}/edge-computing.svg`,
    label: 'Edge Computing',
    image: `${CAT_URL}/edge-computing.svg`,
  },
  EDGE_AI: {
    value: `${CAT_URL_VALUE}/edge-ai.svg`,
    label: 'Edge AI',
    image: `${CAT_URL}/edge-ai.svg`,
  },
  FRAMEWORKS: {
    value: `${CAT_URL_VALUE}/frameworks.svg`,
    label: 'Frameworks',
    image: `${CAT_URL}/frameworks.svg`,
  },
  FRONTEND_DEVELOPMENT: {
    value: `${CAT_URL_VALUE}/frontend-development.svg`,
    label: 'Frontend Development',
    image: `${CAT_URL}/frontend-development.svg`,
  },
  FRONTEND_FRAMEWORK: {
    value: `${CAT_URL_VALUE}/frontend-framework.svg`,
    label: 'Frontend Framework',
    image: `${CAT_URL}/frontend-framework.svg`,
  },
  GENERATIVE_AI: {
    value: `${CAT_URL_VALUE}/generative-ai.svg`,
    label: 'Generative AI',
    image: `${CAT_URL}/generative-ai.svg`,
  },
  HYBRID_CLOUD: {
    value: `${CAT_URL_VALUE}/hybrid-cloud.svg`,
    label: 'Hybrid Cloud',
    image: `${CAT_URL}/hybrid-cloud.svg`,
  },
  LARGE_LANGUAGE_MODEL: {
    value: `${CAT_URL_VALUE}/large-language-model.svg`,
    label: 'Large Language Model',
    image: `${CAT_URL}/large-language-model.svg`,
  },
  LOAD_BALANCING: {
    value: `${CAT_URL_VALUE}/load-balancing.svg`,
    label: 'Load Balancing',
    image: `${CAT_URL}/load-balancing.svg`,
  },
  LOW_CODE_NO_CODE: {
    value: `${CAT_URL_VALUE}/low-code-no-code.svg`,
    label: 'Low-Code/No-Code',
    image: `${CAT_URL}/low-code-no-code.svg`,
  },
  LIBRARIES: {
    value: `${CAT_URL_VALUE}/libraries.svg`,
    label: 'Libraries',
    image: `${CAT_URL}/libraries.svg`,
  },
  MACHINE_LEARNING: {
    value: `${CAT_URL_VALUE}/machine-learning.svg`,
    label: 'Machine Learning',
    image: `${CAT_URL}/machine-learning.svg`,
  },
  NATURAL_LANGUAGE_PROCESSING: {
    value: `${CAT_URL_VALUE}/natural-language-processing.svg`,
    label: 'Natural Language Processing',
    image: `${CAT_URL}/natural-language-processing.svg`,
  },
  NOSQL: {
    value: `${CAT_URL_VALUE}/nosql.svg`,
    label: 'NoSQL',
    image: `${CAT_URL}/nosql.svg`,
  },
  OS: {
    value: `${CAT_URL_VALUE}/os.svg`,
    label: 'OS',
    image: `${CAT_URL}/os.svg`,
  },
  PROGRAMMING_LANGUAGES: {
    value: `${CAT_URL_VALUE}/programming-languages.svg`,
    label: 'Programming Languages',
    image: `${CAT_URL}/programming-languages.svg`,
  },
  PAAS: {
    value: `${CAT_URL_VALUE}/paas.svg`,
    label: 'PaaS',
    image: `${CAT_URL}/paas.svg`,
  },
  PROXY_SERVER: {
    value: `${CAT_URL_VALUE}/proxy-server.svg`,
    label: 'Proxy Server',
    image: `${CAT_URL}/proxy-server.svg`,
  },
  QUALITY_ASSURANCE: {
    value: `${CAT_URL_VALUE}/quality-assurance.svg`,
    label: 'Quality Assurance',
    image: `${CAT_URL}/quality-assurance.svg`,
  },
  QUANTUM_COMPUTING: {
    value: `${CAT_URL_VALUE}/quantum-computing.svg`,
    label: 'Quantum Computing',
    image: `${CAT_URL}/quantum-computing.svg`,
  },
  SERVER_ARCHITECTURE: {
    value: `${CAT_URL_VALUE}/server-architecture.svg`,
    label: 'Server Architecture',
    image: `${CAT_URL}/server-architecture.svg`,
  },
  SERVERLESS_ARCHITECTURE: {
    value: `${CAT_URL_VALUE}/serverless-architecture.svg`,
    label: 'Serverless Architecture',
    image: `${CAT_URL}/serverless-architecture.svg`,
  },
  SHELL_SCRIPTING_LANGUAGES: {
    value: `${CAT_URL_VALUE}/shell-scripting-languages.svg`,
    label: 'Shell Scripting Languages',
    image: `${CAT_URL}/shell-scripting-languages.svg`,
  },
  SAAS: {
    value: `${CAT_URL_VALUE}/saas.svg`,
    label: 'Saas',
    image: `${CAT_URL}/saas.svg`,
  },
  TESTING: {
    value: `${CAT_URL_VALUE}/testing.svg`,
    label: 'Testing',
    image: `${CAT_URL}/testing.svg`,
  },
  USER_EXPERIENCE: {
    value: `${CAT_URL_VALUE}/user-experience.svg`,
    label: 'User Experience',
    image: `${CAT_URL}/user-experience.svg`,
  },
  VIRTUAL_REALITY: {
    value: `${CAT_URL_VALUE}/virtual-reality.svg`,
    label: 'Virtual Reality',
    image: `${CAT_URL}/virtual-reality.svg`,
  },
  WEB_TECHNOLOGIES: {
    value: `${CAT_URL_VALUE}/web-technologies.svg`,
    label: 'Web Technologies',
    image: `${CAT_URL}/web-technologies.svg`,
  },
  WEB_SERVER: {
    value: `${CAT_URL_VALUE}/web-server.svg`,
    label: 'Web Server',
    image: `${CAT_URL}/web-server.svg`,
  },
};
///////////////////////////////////////////////////////////////////////////////
export const TECHNOLOGIES = {
  ADA: {
    value: `${BASE_URL_VALUE}/ada.svg`,
    label: 'Ada',
    image: `${BASE_URL}/ada.svg`,
  },
  AEROSPIKE: {
    value: `${BASE_URL_VALUE}/aerospike.svg`,
    label: 'Aerospike',
    image: `${BASE_URL}/aerospike.svg`,
  },
  AMAZON_AURORA: {
    value: `${BASE_URL_VALUE}/aws-rds.svg`,
    label: 'Amazon Aurora',
    image: `${BASE_URL}/aws-rds.svg`,
  },
  AMAZON_DOCUMENTDB: {
    value: `${BASE_URL_VALUE}/aws.svg`,
    label: 'Amazon DocumentDB',
    image: `${BASE_URL}/aws.svg`,
  },
  AMAZON_DYNAMODB: {
    value: `${BASE_URL_VALUE}/aws-dynamodb.svg`,
    label: 'Amazon DynamoDB',
    image: `${BASE_URL}/aws-dynamodb.svg`,
  },
  AMAZON_REDSHIFT: {
    value: `${BASE_URL_VALUE}/aws.svg`,
    label: 'Amazon Redshift',
    image: `${BASE_URL}/aws.svg`,
  },
  ANSIBLE: {
    value: `${BASE_URL_VALUE}/ansible.svg`,
    label: 'Ansible',
    image: `${BASE_URL}/ansible.svg`,
  },
  APACHE: {
    value: `${BASE_URL_VALUE}/apache.svg`,
    label: 'Apache',
    image: `${BASE_URL}/apache.svg`,
  },
  APACHE_HADOOP: {
    value: `${BASE_URL_VALUE}/hadoop.svg`,
    label: 'Apache Hadoop',
    image: `${BASE_URL}/hadoop.svg`,
  },
  APACHE_HBASE: {
    value: `${BASE_URL_VALUE}/hbase.svg`,
    label: 'Apache HBase',
    image: `${BASE_URL}/hbase.svg`,
  },
  APACHE_IGNITE: {
    value: `${BASE_URL_VALUE}/ignite.svg`,
    label: 'Apache Ignite',
    image: `${BASE_URL}/ignite.svg`,
  },
  APACHE_KAFKA: {
    value: `${BASE_URL_VALUE}/kafka.svg`,
    label: 'Apache Kafka',
    image: `${BASE_URL}/kafka.svg`,
  },
  APACHE_SPARK: {
    value: `${BASE_URL_VALUE}/apachespark.svg`,
    label: 'Apache Spark',
    image: `${BASE_URL}/apachespark.svg`,
  },
  API_GATEWAY: {
    value: `${BASE_URL_VALUE}/api-gateway.svg`,
    label: 'API Gateway',
    image: `${BASE_URL}/api-gateway.svg`,
  },
  ARANGODB: {
    value: `${BASE_URL_VALUE}/arangodb.svg`,
    label: 'ArangoDB',
    image: `${BASE_URL}/arangodb.svg`,
  },
  ASCIIDOC: {
    value: `${BASE_URL_VALUE}/asciidoc.svg`,
    label: 'AsciiDoc',
    image: `${BASE_URL}/asciidoc.svg`,
  },
  ASSEMBLY_LANGUAGE: {
    value: `${BASE_URL_VALUE}/asm.svg`,
    label: 'Assembly Language',
    image: `${BASE_URL}/asm.svg`,
  },
  LANGUAGE_AGNOSTIC: {
    value: `${BASE_URL_VALUE}/language-agnostic.svg`,
    label: 'Language Agnostic',
    image: `${BASE_URL}/language-agnostic.svg`,
  },
  AWK: {
    value: `${BASE_URL_VALUE}/awk.svg`,
    label: 'AWK',
    image: `${BASE_URL}/awk.svg`,
  },
  AZURE: {
    value: `${BASE_URL_VALUE}/azure.svg`,
    label: 'Azure',
    image: `${BASE_URL}/azure.svg`,
  },
  AZURE_COSMOS_DB: {
    value: `${BASE_URL_VALUE}/cosmosdb.svg`,
    label: 'Azure Cosmos DB',
    image: `${BASE_URL}/cosmosdb.svg`,
  },
  AWS_LAMBDA: {
    value: `${BASE_URL_VALUE}/aws-lambda.svg`,
    label: 'AWS Lambda',
    image: `${BASE_URL}/aws-lambda.svg`,
  },
  AWS: {
    value: `${BASE_URL_VALUE}/aws-2.svg`,
    label: 'AWS',
    image: `${BASE_URL}/aws-2.svg`,
  },
  BALLERINA: {
    value: `${BASE_URL_VALUE}/ballerina.svg`,
    label: 'Ballerina',
    image: `${BASE_URL}/ballerina.svg`,
  },
  BIGTABLE: {
    value: `${BASE_URL_VALUE}/bigtable.svg`,
    label: 'Bigtable',
    image: `${BASE_URL}/bigtable.svg`,
  },
  BLAZOR: {
    value: `${BASE_URL_VALUE}/blazor.svg`,
    label: 'Blazor',
    image: `${BASE_URL}/blazor.svg`,
  },
  C: {
    value: `${BASE_URL_VALUE}/c.svg`,
    label: 'C',
    image: `${BASE_URL}/c.svg`,
  },
  CADDY: {
    value: `${BASE_URL_VALUE}/caddy.svg`,
    label: 'Caddy',
    image: `${BASE_URL}/caddy.svg`,
  },
  CASSANDRA: {
    value: `${BASE_URL_VALUE}/cassandra.svg`,
    label: 'Cassandra',
    image: `${BASE_URL}/cassandra.svg`,
  },
  CLOJURE: {
    value: `${BASE_URL_VALUE}/clojure.svg`,
    label: 'Clojure',
    image: `${BASE_URL}/clojure.svg`,
  },
  COBOL: {
    value: `${BASE_URL_VALUE}/cobol.svg`,
    label: 'Cobol',
    image: `${BASE_URL}/cobol.svg`,
  },
  COCKROACHDB: {
    value: `${BASE_URL_VALUE}/cockroachdb.svg`,
    label: 'CockroachDB',
    image: `${BASE_URL}/cockroachdb.svg`,
  },
  COUCHBASE: {
    value: `${BASE_URL_VALUE}/couchbase.svg`,
    label: 'Couchbase',
    image: `${BASE_URL}/couchbase.svg`,
  },
  COUCHDB: {
    value: `${BASE_URL_VALUE}/couchdb.svg`,
    label: 'CouchDB',
    image: `${BASE_URL}/couchdb.svg`,
  },
  CLOUDFLARE: {
    value: `${BASE_URL_VALUE}/cloudflare.svg`,
    label: 'Cloudflare',
    image: `${BASE_URL}/cloudflare.svg`,
  },
  CPP: {
    value: `${BASE_URL_VALUE}/c-plus-plus.svg`,
    label: 'C++',
    image: `${BASE_URL}/c-plus-plus.svg`,
  },
  CRYSTAL: {
    value: `${BASE_URL_VALUE}/crystal.svg`,
    label: 'Crystal',
    image: `${BASE_URL}/crystal.svg`,
  },
  CSS: {
    value: `${BASE_URL_VALUE}/css3.svg`,
    label: 'CSS',
    image: `${BASE_URL}/css3.svg`,
  },
  CSHARP: {
    value: `${BASE_URL_VALUE}/c-sharp.svg`,
    label: 'C#',
    image: `${BASE_URL}/c-sharp.svg`,
  },
  DART: {
    value: `${BASE_URL_VALUE}/dart.svg`,
    label: 'Dart',
    image: `${BASE_URL}/dart.svg`,
  },
  DELPHI_OBJECT_PASCAL: {
    value: `${BASE_URL_VALUE}/delphi.svg`,
    label: 'Delphi/Object Pascal',
    image: `${BASE_URL}/delphi.svg`,
  },
  DIALOGFLOW: {
    value: `${BASE_URL_VALUE}/dialogflow.svg`,
    label: 'Dialogflow',
    image: `${BASE_URL}/dialogflow.svg`,
  },
  DOCKER: {
    value: `${BASE_URL_VALUE}/docker.svg`,
    label: 'Docker',
    image: `${BASE_URL}/docker.svg`,
  },
  DRUID: {
    value: `${BASE_URL_VALUE}/aerospike.svg`,
    label: 'Druid',
    image: `${BASE_URL}/aerospike.svg`,
  },
  ELASTICSEARCH: {
    value: `${BASE_URL_VALUE}/elasticsearch.svg`,
    label: 'Elasticsearch',
    image: `${BASE_URL}/elasticsearch.svg`,
  },
  ELIXIR: {
    value: `${BASE_URL_VALUE}/elixir.svg`,
    label: 'Elixir',
    image: `${BASE_URL}/elixir.svg`,
  },
  ELM: {
    value: `${BASE_URL_VALUE}/elm.svg`,
    label: 'Elm',
    image: `${BASE_URL}/elm.svg`,
  },
  ERLANG: {
    value: `${BASE_URL_VALUE}/erlang.svg`,
    label: 'Erlang',
    image: `${BASE_URL}/erlang.svg`,
  },
  FAUNADB: {
    value: `${BASE_URL_VALUE}/fauna.svg`,
    label: 'FaunaDB',
    image: `${BASE_URL}/fauna.svg`,
  },
  FIREBASE_REALTIME_DATABASE: {
    value: `${BASE_URL_VALUE}/firebase.svg`,
    label: 'Firebase Realtime Database',
    image: `${BASE_URL}/firebase.svg`,
  },
  FLUTTER: {
    value: `${BASE_URL_VALUE}/flutter.svg`,
    label: 'Flutter',
    image: `${BASE_URL}/flutter.svg`,
  },
  FORTRAN: {
    value: `${BASE_URL_VALUE}/fortran.svg`,
    label: 'Fortran',
    image: `${BASE_URL}/fortran.svg`,
  },
  FOUNDATIONDB: {
    value: `${BASE_URL_VALUE}/foundationdb.svg`,
    label: 'FoundationDB',
    image: `${BASE_URL}/foundationdb.svg`,
  },
  FSHARP: {
    value: `${BASE_URL_VALUE}/fsharp.svg`,
    label: 'F#',
    image: `${BASE_URL}/fsharp.svg`,
  },
  GIT: {
    value: `${BASE_URL_VALUE}/git.svg`,
    label: 'Git',
    image: `${BASE_URL}/git.svg`,
  },
  GITHUB: {
    value: `${BASE_URL_VALUE}/github-actions.svg`,
    label: 'GitHub',
    image: `${BASE_URL}/github-actions.svg`,
  },
  GITLAB: {
    value: `${BASE_URL_VALUE}/gitlab.svg`,
    label: 'GitLab',
    image: `${BASE_URL}/gitlab.svg`,
  },
  GO: {
    value: `${BASE_URL_VALUE}/go.svg`,
    label: 'Go',
    image: `${BASE_URL}/go.svg`,
  },
  GCP_BIGQUERY: {
    value: `${BASE_URL_VALUE}/bigquery.svg`,
    label: 'Google Cloud BigQuery',
    image: `${BASE_URL}/bigquery.svg`,
  },
  GOOGLE_CLOUD_SPANNER: {
    value: `${BASE_URL_VALUE}/spanner.svg`,
    label: 'Google Cloud Spanner',
    image: `${BASE_URL}/spanner.svg`,
  },
  GOOGLE_CLOUD_FUNCTIONS: {
    value: `${BASE_URL_VALUE}/google-cloud-functions.svg`,
    label: 'Google Cloud Functions',
    image: `${BASE_URL}/google-cloud-functions.svg`,
  },
  GRAFANA: {
    value: `${BASE_URL_VALUE}/grafana.svg`,
    label: 'Grafana',
    image: `${BASE_URL}/grafana.svg`,
  },
  GRAPHDB: {
    value: `${BASE_URL_VALUE}/aerospike.svg`,
    label: 'GraphDB',
    image: `${BASE_URL}/aerospike.svg`,
  },
  GRAPHQL: {
    value: `${BASE_URL_VALUE}/graphql.svg`,
    label: 'GraphQL',
    image: `${BASE_URL}/graphql.svg`,
  },
  GROOVY: {
    value: `${BASE_URL_VALUE}/groovy.svg`,
    label: 'Groovy',
    image: `${BASE_URL}/groovy.svg`,
  },
  HUGGING_FACE: {
    value: `${BASE_URL_VALUE}/hugging.svg`,
    label: 'Hugging Face',
    image: `${BASE_URL}/hugging.svg`,
  },
  HASKELL: {
    value: `${BASE_URL_VALUE}/haskell.svg`,
    label: 'Haskell',
    image: `${BASE_URL}/haskell.svg`,
  },
  HAPROXY: {
    value: `${BASE_URL_VALUE}/haproxy.svg`,
    label: 'HAProxy',
    image: `${BASE_URL}/haproxy.svg`,
  },
  HTML: {
    value: `${BASE_URL_VALUE}/html5.svg`,
    label: 'HTML',
    image: `${BASE_URL}/html5.svg`,
  },
  IBM: {
    value: `${BASE_URL_VALUE}/ibm.svg`,
    label: 'IBM',
    image: `${BASE_URL}/ibm.svg`,
  },
  IBM_DB2: {
    value: `${BASE_URL_VALUE}/ibm-db2.svg`,
    label: 'IBM Db2',
    image: `${BASE_URL}/ibm-db2.svg`,
  },
  INFLUXDB: {
    value: `${BASE_URL_VALUE}/influxdb.svg`,
    label: 'InfluxDB',
    image: `${BASE_URL}/influxdb.svg`,
  },
  JAVA: {
    value: `${BASE_URL_VALUE}/java.svg`,
    label: 'Java',
    image: `${BASE_URL}/java.svg`,
  },
  JAVASCRIPT: {
    value: `${BASE_URL_VALUE}/javascript.svg`,
    label: 'JavaScript',
    image: `${BASE_URL}/javascript.svg`,
  },
  JENKINS: {
    value: `${BASE_URL_VALUE}/jenkins.svg`,
    label: 'Jenkins',
    image: `${BASE_URL}/jenkins.svg`,
  },
  JULIA: {
    value: `${BASE_URL_VALUE}/julia.svg`,
    label: 'Julia',
    image: `${BASE_URL}/julia.svg`,
  },
  JSON: {
    value: `${BASE_URL_VALUE}/json.svg`,
    label: 'JSON',
    image: `${BASE_URL}/json.svg`,
  },
  KOTLIN: {
    value: `${BASE_URL_VALUE}/kotlin.svg`,
    label: 'Kotlin',
    image: `${BASE_URL}/kotlin.svg`,
  },
  KUBERNETES: {
    value: `${BASE_URL_VALUE}/kubernetes.svg`,
    label: 'Kubernetes',
    image: `${BASE_URL}/kubernetes.svg`,
  },
  LATEX: {
    value: `${BASE_URL_VALUE}/latex.svg`,
    label: 'LaTeX',
    image: `${BASE_URL}/latex.svg`,
  },
  LISP: {
    value: `${BASE_URL_VALUE}/lisp.svg`,
    label: 'Lisp',
    image: `${BASE_URL}/lisp.svg`,
  },
  LIGHTTPD: {
    value: `${BASE_URL_VALUE}/lighttpd.svg`,
    label: 'Lighttpd',
    image: `${BASE_URL}/lighttpd.svg`,
  },
  LUA: {
    value: `${BASE_URL_VALUE}/lua.svg`,
    label: 'Lua',
    image: `${BASE_URL}/lua.svg`,
  },
  MARKDOWN: {
    value: `${BASE_URL_VALUE}/markdown.svg`,
    label: 'Markdown',
    image: `${BASE_URL}/markdown.svg`,
  },
  MARIADB: {
    value: `${BASE_URL_VALUE}/mariadb.svg`,
    label: 'MariaDB',
    image: `${BASE_URL}/mariadb.svg`,
  },
  MATLAB: {
    value: `${BASE_URL_VALUE}/matlab.svg`,
    label: 'MATLAB',
    image: `${BASE_URL}/matlab.svg`,
  },
  MEMSQL: {
    value: `${BASE_URL_VALUE}/memsql.svg`,
    label: 'MemSQL',
    image: `${BASE_URL}/memsql.svg`,
  },
  MICROSOFT_AZURE_SQL_DATABASE: {
    value: `${BASE_URL_VALUE}/sql-azure-db.svg`,
    label: 'Microsoft Azure SQL Database',
    image: `${BASE_URL}/sql-azure-db.svg`,
  },
  MICROSOFT_SQL_SERVER: {
    value: `${BASE_URL_VALUE}/microsoft.svg`,
    label: 'Microsoft SQL Server',
    image: `${BASE_URL}/microsoft.svg`,
  },
  MONGODB: {
    value: `${BASE_URL_VALUE}/mongodb.svg`,
    label: 'MongoDB',
    image: `${BASE_URL}/mongodb.svg`,
  },
  MYSQL: {
    value: `${BASE_URL_VALUE}/mysql.svg`,
    label: 'MySQL',
    image: `${BASE_URL}/mysql.svg`,
  },
  NEO4J: {
    value: `${BASE_URL_VALUE}/neo4j.svg`,
    label: 'Neo4j',
    image: `${BASE_URL}/neo4j.svg`,
  },
  NIM: {
    value: `${BASE_URL_VALUE}/nim.svg`,
    label: 'Nim',
    image: `${BASE_URL}/nim.svg`,
  },
  NODE_JS: {
    value: `${BASE_URL_VALUE}/nodejs.svg`,
    label: 'Node.js',
    image: `${BASE_URL}/nodejs.svg`,
  },
  NGINX: {
    value: `${BASE_URL_VALUE}/nginx.svg`,
    label: 'Nginx',
    image: `${BASE_URL}/nginx.svg`,
  },
  OBJECTIVEC: {
    value: `${BASE_URL_VALUE}/objectivec.svg`,
    label: 'Objective-C',
    image: `${BASE_URL}/objectivec.svg`,
  },
  OCAML: {
    value: `${BASE_URL_VALUE}/ocaml.svg`,
    label: 'OCaml',
    image: `${BASE_URL}/ocaml.svg`,
  },
  OPENCV: {
    value: `${BASE_URL_VALUE}/opencv.svg`,
    label: 'OpenCV',
    image: `${BASE_URL}/opencv.svg`,
  },
  ORACLE_DATABASE: {
    value: `${BASE_URL_VALUE}/oracle.svg`,
    label: 'Oracle Database',
    image: `${BASE_URL}/oracle.svg`,
  },
  ORIENTDB: {
    value: `${BASE_URL_VALUE}/database.svg`,
    label: 'OrientDB',
    image: `${BASE_URL}/database.svg`,
  },
  OPENAI: {
    value: `${BASE_URL_VALUE}/openai.svg`,
    label: 'OpenAI',
    image: `${BASE_URL}/openai.svg`,
  },
  PANDAS: {
    value: `${BASE_URL_VALUE}/pandas.svg`,
    label: 'Pandas',
    image: `${BASE_URL}/pandas.svg`,
  },
  PASCAL: {
    value: `${BASE_URL_VALUE}/pascal.svg`,
    label: 'Pascal',
    image: `${BASE_URL}/pascal.svg`,
  },
  PERL: {
    value: `${BASE_URL_VALUE}/perl.svg`,
    label: 'Perl',
    image: `${BASE_URL}/perl.svg`,
  },
  PHP: {
    value: `${BASE_URL_VALUE}/php.svg`,
    label: 'PHP',
    image: `${BASE_URL}/php.svg`,
  },
  POSTGRESQL: {
    value: `${BASE_URL_VALUE}/postgresql.svg`,
    label: 'PostgreSQL',
    image: `${BASE_URL}/postgresql.svg`,
  },
  PROLOG: {
    value: `${BASE_URL_VALUE}/prolog.svg`,
    label: 'Prolog',
    image: `${BASE_URL}/prolog.svg`,
  },
  PROMETHEUS: {
    value: `${BASE_URL_VALUE}/prometheus.svg`,
    label: 'Prometheus',
    image: `${BASE_URL}/prometheus.svg`,
  },
  PROTOBUF: {
    value: `${BASE_URL_VALUE}/protobuf.svg`,
    label: 'Protocol Buffers',
    image: `${BASE_URL}/protobuf.svg`,
  },
  PUPPET: {
    value: `${BASE_URL_VALUE}/puppet.svg`,
    label: 'Puppet',
    image: `${BASE_URL}/puppet.svg`,
  },
  PYTHON: {
    value: `${BASE_URL_VALUE}/python.svg`,
    label: 'Python',
    image: `${BASE_URL}/python.svg`,
  },
  PYTORCH: {
    value: `${BASE_URL_VALUE}/pytorch.svg`,
    label: 'PyTorch',
    image: `${BASE_URL}/pytorch.svg`,
  },
  RAVENDB: {
    value: `${BASE_URL_VALUE}/ravendb.svg`,
    label: 'RavenDB',
    image: `${BASE_URL}/ravendb.svg`,
  },
  REASONML: {
    value: `${BASE_URL_VALUE}/reasonml.svg`,
    label: 'ReasonML',
    image: `${BASE_URL}/reasonml.svg`,
  },
  REDIS: {
    value: `${BASE_URL_VALUE}/redis.svg`,
    label: 'Redis',
    image: `${BASE_URL}/redis.svg`,
  },
  RETHINKDB: {
    value: `${BASE_URL_VALUE}/rethinkdb.svg`,
    label: 'RethinkDB',
    image: `${BASE_URL}/rethinkdb.svg`,
  },
  ROCKSDB: {
    value: `${BASE_URL_VALUE}/rocksdb.svg`,
    label: 'RocksDB',
    image: `${BASE_URL}/rocksdb.svg`,
  },
  RUBY: {
    value: `${BASE_URL_VALUE}/ruby.svg`,
    label: 'Ruby',
    image: `${BASE_URL}/ruby.svg`,
  },
  RUST: {
    value: `${BASE_URL_VALUE}/rust.svg`,
    label: 'Rust',
    image: `${BASE_URL}/rust.svg`,
  },
  SAP_HANA: {
    value: `${BASE_URL_VALUE}/sap.svg`,
    label: 'SAP HANA',
    image: `${BASE_URL}/sap.svg`,
  },
  SAS: {
    value: `${BASE_URL_VALUE}/sas.svg`,
    label: 'SAS',
    image: `${BASE_URL}/sas.svg`,
  },
  SALESFORCE: {
    value: `${BASE_URL_VALUE}/salesforce.svg`,
    label: 'Salesforce',
    image: `${BASE_URL}/salesforce.svg`,
  },
  SCALA: {
    value: `${BASE_URL_VALUE}/scala.svg`,
    label: 'Scala',
    image: `${BASE_URL}/scala.svg`,
  },
  SCHEME: {
    value: `${BASE_URL_VALUE}/scheme.svg`,
    label: 'Scheme',
    image: `${BASE_URL}/scheme.svg`,
  },
  SCYLLADB: {
    value: `${BASE_URL_VALUE}/scylladb.svg`,
    label: 'ScyllaDB',
    image: `${BASE_URL}/scylladb.svg`,
  },
  SGML: {
    value: `${BASE_URL_VALUE}/programing-language.svg`,
    label: 'SGML',
    image: `${BASE_URL}/programing-language.svg`,
  },
  SHOPIFY: {
    value: `${BASE_URL_VALUE}/shopify.svg`,
    label: 'Shopify',
    image: `${BASE_URL}/shopify.svg`,
  },
  SMALLTALK: {
    value: `${BASE_URL_VALUE}/programing-language.svg`,
    label: 'Smalltalk',
    image: `${BASE_URL}/programing-language.svg`,
  },
  SNOWFLAKE: {
    value: `${BASE_URL_VALUE}/snowflake.svg`,
    label: 'Snowflake',
    image: `${BASE_URL}/snowflake.svg`,
  },
  SQL: {
    value: `${BASE_URL_VALUE}/sql.svg`,
    label: 'SQL',
    image: `${BASE_URL}/sql.svg`,
  },
  SQLITE: {
    value: `${BASE_URL_VALUE}/sqlite.svg`,
    label: 'SQLite',
    image: `${BASE_URL}/sqlite.svg`,
  },
  SWIFT: {
    value: `${BASE_URL_VALUE}/swift.svg`,
    label: 'Swift',
    image: `${BASE_URL}/swift.svg`,
  },
  TERADATA: {
    value: `${BASE_URL_VALUE}/teradata.svg`,
    label: 'Teradata',
    image: `${BASE_URL}/teradata.svg`,
  },
  TENSORFLOW_EXTENDED: {
    value: `${BASE_URL_VALUE}/tensorflow.svg`,
    label: 'TensorFlow Extended (TFX)',
    image: `${BASE_URL}/tensorflow.svg`,
  },
  TIGERGRAPH: {
    value: `${BASE_URL_VALUE}/tigergraph.svg`,
    label: 'TigerGraph',
    image: `${BASE_URL}/tigergraph.svg`,
  },
  TIMESCALEDB: {
    value: `${BASE_URL_VALUE}/timescaledb.svg`,
    label: 'TimescaleDB',
    image: `${BASE_URL}/timescaledb.svg`,
  },
  TOMCAT: {
    value: `${BASE_URL_VALUE}/tomcat.svg`,
    label: 'Tomcat',
    image: `${BASE_URL}/tomcat.svg`,
  },
  TRAEFIK: {
    value: `${BASE_URL_VALUE}/traefik.svg`,
    label: 'Traefik',
    image: `${BASE_URL}/traefik.svg`,
  },
  TYPESCRIPT: {
    value: `${BASE_URL_VALUE}/typescript.svg`,
    label: 'TypeScript',
    image: `${BASE_URL}/typescript.svg`,
  },
  VBA: {
    value: `${BASE_URL_VALUE}/vba.svg`,
    label: 'VBA',
    image: `${BASE_URL}/vba.svg`,
  },
  VOLTDB: {
    value: `${BASE_URL_VALUE}/voltdb.svg`,
    label: 'VoltDB',
    image: `${BASE_URL}/voltdb.svg`,
  },
  WEBASSEMBLY: {
    value: `${BASE_URL_VALUE}/webassembly.svg`,
    label: 'WebAssembly',
    image: `${BASE_URL}/webassembly.svg`,
  },
  WORDPRESS: {
    value: `${BASE_URL_VALUE}/wordpress.svg`,
    label: 'WordPress',
    image: `${BASE_URL}/wordpress.svg`,
  },
  XHTML: {
    value: `${BASE_URL_VALUE}/xhtml.svg`,
    label: 'XHTML',
    image: `${BASE_URL}/xhtml.svg`,
  },
  XML: {
    value: `${BASE_URL_VALUE}/xml.svg`,
    label: 'XML',
    image: `${BASE_URL}/xml.svg`,
  },
  YAML: {
    value: `${BASE_URL_VALUE}/yaml.svg`,
    label: 'YAML',
    image: `${BASE_URL}/yaml.svg`,
  },
  YUGABYTE_DB: {
    value: `${BASE_URL_VALUE}/yugabyte.svg`,
    label: 'YugaByte DB',
    image: `${BASE_URL}/yugabyte.svg`,
  },
  ZIG: {
    value: `${BASE_URL_VALUE}/zig.svg`,
    label: 'Zig',
    image: `${BASE_URL}/zig.svg`,
  },
};
///////////////////////////////////////////////////////////////////////////////
export const trendCategoryValues = Object.values(TREND_CATEGORY).map(
  (category) => category.label // Compare labels, not URLs
);

export const technologiesValues = Object.values(TECHNOLOGIES).map(
  (tech) => tech.label // Compare labels, not URLs
); //extracting values outside of the schema & validation
