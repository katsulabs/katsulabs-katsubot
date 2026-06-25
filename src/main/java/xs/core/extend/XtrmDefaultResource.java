package xs.core.extend;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;

import xs.core.database.XtrmDAOWeb;
import xs.core.property.XtrmProperty;

public class XtrmDefaultResource {

	/* Config Property Object */
	@Resource(name = "xtrmProperty")
	public XtrmProperty mobjXtrmConfig;

	/* Data Access Object */
	@Autowired
	public XtrmDAOWeb mobjXtrmDao;

}
