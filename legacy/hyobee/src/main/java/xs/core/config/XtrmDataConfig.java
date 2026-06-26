package xs.core.config;

import javax.sql.DataSource;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

import net.sf.log4jdbc.Log4jdbcProxyDataSource;
import net.sf.log4jdbc.tools.Log4JdbcCustomFormatter;
import net.sf.log4jdbc.tools.LoggingType;
import xs.core.factory.XtrmRefreshableSqlSessionFactory;
import xs.core.property.XtrmProperty;

@Configuration
@DependsOn("xtrmProperty")
@MapperScan(
		basePackages = { "xs.*" },
		annotationClass = Mapper.class,
		sqlSessionFactoryRef = "xtrmdbSqlSessionFactory"
	)
@EnableTransactionManagement
public class XtrmDataConfig {

	@Autowired
	private ApplicationContext applicationContext;

	@Autowired
	private XtrmProperty mobjXtrmConfig;

	@Primary
	@Bean //(name = "primaryDataSource")
	public DataSource xtrmdbJdbc() {
		String xtrmdbJdbcDriver				= mobjXtrmConfig.getString("XTRMDB_JDBC_DRIVER"		   );
		String xtrmdbJdbcUrl				= mobjXtrmConfig.getString("XTRMDB_JDBC_URL"			  );
		String xtrmdbJdbcUserId				= mobjXtrmConfig.getString("XTRMDB_JDBC_USER_ID"		  );
		String xtrmdbJdbcUserPw				= mobjXtrmConfig.getString("XTRMDB_JDBC_USER_PW"		  );
		String xtrmdbJdbcValidationQuery	= mobjXtrmConfig.getString("XTRMDB_JDBC_VALIDATION_QUERY" );
		int xtrmdbJdbcInitialSize			= mobjXtrmConfig.getInt(   "XTRMDB_JDBC_INITIAL_SIZE"	 );
		int xtrmdbJdbcMaxActive				= mobjXtrmConfig.getInt(   "XTRMDB_JDBC_MAX_ACTIVE"	   );
		int xtrmdbJdbcMaxIdle				= mobjXtrmConfig.getInt(   "XTRMDB_JDBC_MAX_IDLE"		 );
		int xtrmdbJdbcMinIdle				= mobjXtrmConfig.getInt(   "XTRMDB_JDBC_MIN_IDLE"		 );
		int xtrmdbJdbcMaxWait				= mobjXtrmConfig.getInt(   "XTRMDB_JDBC_MAX_WAIT"		 );

		org.apache.tomcat.jdbc.pool.DataSource dataSource = new org.apache.tomcat.jdbc.pool.DataSource();
		dataSource.setDriverClassName(xtrmdbJdbcDriver);
		dataSource.setUrl(xtrmdbJdbcUrl);
		dataSource.setUsername(xtrmdbJdbcUserId);
		dataSource.setPassword(xtrmdbJdbcUserPw);
		dataSource.setValidationQuery(xtrmdbJdbcValidationQuery);
		dataSource.setInitialSize(xtrmdbJdbcInitialSize);
		dataSource.setMaxActive(xtrmdbJdbcMaxActive);
		dataSource.setMaxIdle(xtrmdbJdbcMaxIdle);
		dataSource.setMinIdle(xtrmdbJdbcMinIdle);
		dataSource.setMaxWait(xtrmdbJdbcMaxWait);
		dataSource.setTestWhileIdle(true);
		dataSource.setTestOnBorrow(true);

		Log4JdbcCustomFormatter formatter = new Log4JdbcCustomFormatter();
		formatter.setLoggingType(LoggingType.MULTI_LINE);
		formatter.setSqlPrefix("XTRM_SQL:\n");
		Log4jdbcProxyDataSource log4jdbcProxyDataSource = new Log4jdbcProxyDataSource(dataSource);
		log4jdbcProxyDataSource.setLogFormatter(formatter);
		return log4jdbcProxyDataSource;
	}

	@Bean
	public SqlSessionFactory xtrmdbSqlSessionFactory() throws Exception {
//		org.apache.ibatis.session.Configuration config = new org.apache.ibatis.session.Configuration();
//		config.setDatabaseId("xtrmdb");
//		config.setCallSettersOnNulls(true);
//		config.setLogImpl(org.apache.ibatis.logging.slf4j.Slf4jImpl.class);
//		config.setCacheEnabled(true);
//		config.setLazyLoadingEnabled(true);
//		config.setMultipleResultSetsEnabled(true);
//		config.setUseColumnLabel(true);
//		config.setUseGeneratedKeys(false);
//		config.setDefaultExecutorType(ExecutorType.SIMPLE);
//		config.setDefaultStatementTimeout(5000);
//		config.setSafeRowBoundsEnabled(false);
//		config.setMapUnderscoreToCamelCase(false);
//		config.setLocalCacheScope(LocalCacheScope.SESSION);
//		config.setJdbcTypeForNull(JdbcType.NULL);
//		config.setLazyLoadTriggerMethods(new HashSet<String>(Arrays.asList("equals,clone,hashCode,toString".split(","))));
//		SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
//		if("REAL".equals(xtrmProperty.getServiceMode())) {
//			sqlSessionFactoryBean = new SqlSessionFactoryBean();
//		}else{
//			sqlSessionFactoryBean = new XtrmRefreshableSqlSessionFactory("xtrmdw");
//		}
		XtrmRefreshableSqlSessionFactory sqlSessionFactory = new XtrmRefreshableSqlSessionFactory();
		sqlSessionFactory.setDataSource(this.xtrmdbJdbc());
		sqlSessionFactory.setConfigLocation(applicationContext.getResource("classpath:/mybatis/xs/config/xtrmSqlConfig.xml"));
//		sqlSessionFactory.setConfiguration(config);
		sqlSessionFactory.setMapperLocations(applicationContext.getResources("classpath*:/mybatis/xs/**/dao/xml/**/*.xml"));
		sqlSessionFactory.setTypeHandlers(new TypeHandler[] { new XtrmDateHandler() });
		sqlSessionFactory.afterPropertiesSet();
		return sqlSessionFactory.getObject();
	}

	@Bean(destroyMethod = "clearCache")
	public SqlSessionTemplate xtrmdbSqlSession() throws Exception {
		SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(this.xtrmdbSqlSessionFactory());
		return sqlSessionTemplate;
	}

	@Bean
	public TransactionTemplate xtrmdbTx() {
		TransactionTemplate transactionTemplate = new TransactionTemplate();
		transactionTemplate.setTransactionManager(this.xtrmdbTxManager());
		transactionTemplate.setIsolationLevelName("ISOLATION_READ_COMMITTED");
		return transactionTemplate;
	}

	@Primary
	@Bean(name = "transactionManager")
	public PlatformTransactionManager xtrmdbTxManager() {
		return new DataSourceTransactionManager(this.xtrmdbJdbc());
	}

}
