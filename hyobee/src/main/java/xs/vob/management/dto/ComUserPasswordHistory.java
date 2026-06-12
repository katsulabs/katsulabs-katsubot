package xs.vob.management.dto;

import java.sql.Timestamp;

public class ComUserPasswordHistory {
	private String companyCode;
	private String userId;
	private String historyKey;
	private String passwordEncpt;
	private String encptKeyInfo;
	private String changeDt;
	private String firstCreateUserId;
	private Timestamp createDt;
	private String todayChangeAt;
	public String getCompanyCode() {
		return companyCode;
	}
	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getHistoryKey() {
		return historyKey;
	}
	public void setHistoryKey(String historyKey) {
		this.historyKey = historyKey;
	}
	public String getPasswordEncpt() {
		return passwordEncpt;
	}
	public void setPasswordEncpt(String passwordEncpt) {
		this.passwordEncpt = passwordEncpt;
	}
	public String getEncptKeyInfo() {
		return encptKeyInfo;
	}
	public void setEncptKeyInfo(String encptKeyInfo) {
		this.encptKeyInfo = encptKeyInfo;
	}
	public String getChangeDt() {
		return changeDt;
	}
	public void setChangeDt(String changeDt) {
		this.changeDt = changeDt;
	}
	public String getFirstCreateUserId() {
		return firstCreateUserId;
	}
	public void setFirstCreateUserId(String firstCreateUserId) {
		this.firstCreateUserId = firstCreateUserId;
	}
	public Timestamp getCreateDt() {
		return createDt;
	}
	public void setCreateDt(Timestamp createDt) {
		this.createDt = createDt;
	}
	public String getTodayChangeAt() {
		return todayChangeAt;
	}
	public void setTodayChangeAt(String todayChangeAt) {
		this.todayChangeAt = todayChangeAt;
	}

}
