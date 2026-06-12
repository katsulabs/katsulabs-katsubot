package xs.core.factory;

import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.core.io.Resource;
import org.springframework.util.ReflectionUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * mybatis mapper 자동 감지 후 자동으로 서버 재시작이 필요 없이 반영
 */
@Slf4j
public class XtrmRefreshableSqlSessionFactory extends SqlSessionFactoryBean implements DisposableBean {

	private SqlSessionFactory proxy;
	private int interval = 500;
	private Timer timer;
	private TimerTask task;
	private Resource[] mapperLocations;
	/* 파일 감시 쓰레드가 실행중인지 여부 */
	private boolean running = false;
	private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
	private final Lock r = rwl.readLock();
	private final Lock w = rwl.writeLock();

	public XtrmRefreshableSqlSessionFactory() {

	}

	public XtrmRefreshableSqlSessionFactory(String dataResource) {
		log.info("dataResourceName :" + dataResource);
	}

	@Override
	public void setMapperLocations(Resource... mapperLocations) {
		super.setMapperLocations(mapperLocations);
		this.mapperLocations = mapperLocations;
	}

	public void setInterval(int interval) {
		this.interval = interval;
	}

	/**
	 * @throws Exception
	 */
	public void refresh() throws Exception {
		w.lock();
		try {
			Configuration newConfig = new Configuration();
			ReflectionUtils.shallowCopyFieldState(super.getObject().getConfiguration(), newConfig);
			super.setConfiguration(newConfig);
			super.afterPropertiesSet();
		} catch (Exception e) {
			log.error("ReflectionUtils.shallowCopyFieldState ERROR", e);
		} finally {
			w.unlock();
		}
	}

	/**
	 * 싱글톤 멤버로 SqlMapClient 원본 대신 프록시로 설정하도록 오버라이드.
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();

//		setRefreshable();
	}

	private void setRefreshable() {
		proxy = (SqlSessionFactory) Proxy.newProxyInstance(SqlSessionFactory.class.getClassLoader(),
				new Class[] { SqlSessionFactory.class }, new InvocationHandler() {
					@Override
					public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
						log.debug("method.getName() : " + method.getName());
						return method.invoke(getParentObject(), args);
					}
				});

		task = new TimerTask() {
			private Map<Resource, Long> map = new HashMap<>();

			@Override
			public void run() {
				if (isModified()) {
					try {
						refresh();
					} catch (Exception e) {
						log.error("caught exception", e);
					}
				}
			}

			private boolean isModified() {
				boolean retVal = false;
				if (mapperLocations != null) {
					for (int i = 0; i < mapperLocations.length; i++) {
						Resource mappingLocation = mapperLocations[i];
						retVal |= findModifiedResource(mappingLocation);
					}
				}
				return retVal;
			}

			@SuppressWarnings("removal")
			private boolean findModifiedResource(Resource resource) {
				boolean retVal = false;
				List<String> updateDtResources = new ArrayList<>();
				try {
					long updateDt = resource.lastModified();
					if (map.containsKey(resource)) {
						long lastModified = map.get(resource).longValue();
						if (lastModified != updateDt) {
							map.put(resource, new Long(updateDt));
							updateDtResources.add(resource.getDescription());
							retVal = true;
						}
					} else {
						map.put(resource, new Long(updateDt));
					}
				} catch (IOException e) {
					log.error("caught exception", e);
				}
				if (retVal) {
					if (log.isInfoEnabled()) {
						log.info("updateDt files : " + updateDtResources);
					}
				}
				return retVal;
			}
		};

		timer = new Timer(true);
		resetInterval();
	}

	private Object getParentObject() throws Exception {
		r.lock();
		try {
			return super.getObject();
		} finally {
			r.unlock();
		}
	}

	@Override
	public SqlSessionFactory getObject() {
		if (this.proxy == null) {
			setRefreshable();
		}
		return this.proxy;
	}

	@Override
	public Class<? extends SqlSessionFactory> getObjectType() {
		return (this.proxy != null ? this.proxy.getClass() : SqlSessionFactory.class);
	}

	@Override
	public boolean isSingleton() {
		return true;
	}

	public void setCheckInterval(int ms) {
		interval = ms;
		if (timer != null) {
			resetInterval();
		}
	}

	private void resetInterval() {
		if (running) {
			timer.cancel();
			running = false;
		}
		if (interval > 0) {
			timer.schedule(task, 0, interval);
			running = true;
		}
	}

	@Override
	public void destroy() throws Exception {
		timer.cancel();
	}

}
