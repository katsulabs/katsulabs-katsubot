package xs.core.handler.app;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class XtrmHttpSessionListener implements HttpSessionListener, HttpSessionAttributeListener {

	private static Map<String, HttpSession> sessions = new HashMap<>();

	public static boolean isAlreadyLogedIn(String userId, HttpSession session) {
		if (!sessions.containsKey(userId)) {
			return false;
		} else {
			if (sessions.get(userId).getId().equals(session.getId())) {
				return false;
			}
		}
		// 만약 세션 정보가 같다면 인터셉터에서 처리해야한다.
		return true;
	}

	public static boolean isAlreadyLogedIn(HttpSession session) {
		for (String tempUserId : sessions.keySet()) {
			HttpSession originSession = sessions.get(tempUserId);
			if (originSession.getId().equals(session.getId())) {
				return true;
			}
		}
		return false;
	}

	public static HttpSession getSession(String userId) {
		return sessions.get(userId);
	}

	public static HttpSession getSession(HttpSession session) {
		for (String tempUserId : sessions.keySet()) {
			HttpSession originSession = sessions.get(tempUserId);
			if (originSession.getId().equals(session.getId())) {
				return originSession;
			}
		}
		return session;
	}

	public static void xtrmCreateSession(String userId, HttpSession session) {
		sessions.put(userId, session);
		log.debug("Current session List");
		for (String tempUserId : sessions.keySet()) {
			log.debug(tempUserId + ": " + sessions.get(tempUserId).getId() + "/ "
					+ new Timestamp(System.currentTimeMillis()));
		}
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		HttpSession session = se.getSession();
		log.debug("removed");
		sessions.remove(session.getAttribute("USER_ID"));
		log.debug("Current session List");
		for (String tempUserId : sessions.keySet()) {
			log.debug(tempUserId + ": " + sessions.get(tempUserId).getId() + "/ "
					+ new Timestamp(System.currentTimeMillis()));
		}
	}

	@Override
	public void attributeAdded(HttpSessionBindingEvent se) {
		// do nothing
	}

	@Override
	public void sessionCreated(HttpSessionEvent se) {
		// do nothing
	}

	@Override
	public void attributeRemoved(HttpSessionBindingEvent se) {
		// do nothing
	}

	@Override
	public void attributeReplaced(HttpSessionBindingEvent se) {
		// do nothing
	}

}
