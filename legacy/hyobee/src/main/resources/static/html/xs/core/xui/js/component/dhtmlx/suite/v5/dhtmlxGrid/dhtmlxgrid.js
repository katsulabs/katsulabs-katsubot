/*
Product Name: dhtmlxSuite 
Version: 5.1.0 
Edition: Professional 
License: content of this file is covered by DHTMLX Commercial or Enterprise license. Usage without proper license is prohibited. To obtain it contact sales@dhtmlx.com
Copyright UAB Dinamenta http://www.dhtmlx.com
*/

//latest dev. version

/*_TOPICS_
@0:initialization
@1:selection control
@2:rows control
@3:colums control
@4:cells controll
@5:data manipulation
@6:appearence control
@7:overal control
@8:tools
@9:treegrid
@10: event handlers
@11: paginal output
*/

var globalActiveDHTMLGridObject;
String.prototype._dhx_trim=function(){
	return this.replace(/&nbsp;/g, " ").replace(/(^[ \t]*)|([ \t]*$)/g, "");
}

function dhtmlxArray(ar){
	return dhtmlx.extend((ar||new Array()), dhtmlxArray._master);
};
dhtmlxArray._master={
	_dhx_find:function(pattern){
		for (var i = 0; i < this.length; i++){
			if (pattern == this[i])
				return i;
		}
		return -1;
	},
	_dhx_insertAt:function(ind, value){
		this[this.length]=null;
		for (var i = this.length-1; i >= ind; i--)
			this[i]=this[i-1]
		this[ind]=value
	},
	_dhx_removeAt:function(ind){
		this.splice(ind,1)
	},
	_dhx_swapItems:function(ind1, ind2){
		var tmp = this[ind1];
		this[ind1]=this[ind2]
		this[ind2]=tmp;
	}
}

/**
*   @desc: dhtmlxGrid constructor
*   @param: id - (optional) id of div element to base grid on
*   @returns: dhtmlxGrid object
*   @type: public
*/
function dhtmlXGridObject(id){
	if (dhtmlxEvent.initTouch)
		dhtmlxEvent.initTouch();
	
	if (_isIE)
	try{
		document.execCommand("BackgroundImageCache", false, true);
	}
	catch (e){}
	
	if (id){
		if (typeof (id) == 'object'){
			this.entBox=id
			if (!this.entBox.id) this.entBox.id="cgrid2_"+this.uid();
		} else
		this.entBox=document.getElementById(id);
	} else {
		this.entBox=document.createElement("DIV");
		this.entBox.id="cgrid2_"+this.uid();
	}
	this.entBox.innerHTML="";
	dhx4._eventable(this);
	
	var self = this;
	
	this._RaSeCol=[];
	this._wcorr=0;
	this.fontWidth = 7;
	this.cell=null;
	this.row=null;
	this.iconURL="";
	this.editor=null;
	this._f2kE=true;
	this._dclE=true;
	this.combos=new Array(0);
	this.defVal=new Array(0);
	this.rowsAr={
	};
	
	this.rowsBuffer=dhtmlxArray();
	this.rowsCol=dhtmlxArray(); //array of rows by index
	
	this._data_cache={
	};
	
	this._ecache={
	}
	
	this._ud_enabled=true;
	this.xmlLoader=this.doLoadDetails;
	
	this._maskArr=[];
	this.selectedRows=dhtmlxArray(); //selected rows array
	
	this.UserData={};//hash of row related userdata (and for grid - "gridglobaluserdata")
	this._sizeFix=this._borderFix=0;
	/*MAIN OBJECTS*/
	
	this.entBox.className+=" gridbox";
	
	this.entBox.style.width=this.entBox.getAttribute("width")
	||(window.getComputedStyle
		? (this.entBox.style.width||window.getComputedStyle(this.entBox, null)["width"])
		: (this.entBox.currentStyle
			? this.entBox.currentStyle["width"]
			: this.entBox.style.width||0))
	||"100%";
	
	this.entBox.style.height=this.entBox.getAttribute("height")
	||(window.getComputedStyle
		? (this.entBox.style.height||window.getComputedStyle(this.entBox, null)["height"])
		: (this.entBox.currentStyle
			? this.entBox.currentStyle["height"]
			: this.entBox.style.height||0))
	||"100%";
	//cursor and text selection
	this.entBox.style.cursor='default';
	
	this.entBox.onselectstart=function(){
		/*return false;*/
		/*HSITX*/
		return true;
		/**/
	}; //avoid text select
	var t_creator=function(name){
		var t=document.createElement("TABLE");
		/*ORIGINAL
		t.cellSpacing=t.cellPadding=0;
		*/
		/*HSITX*/
		if(name !== "c_obj"){
			t.cellSpacing=t.cellPadding=0;
		}
		/**/
		t.style.cssText='width:100%;table-layout:fixed;';
		t.className=name.substr(2);
		return t;
	}
	this.obj=t_creator("c_obj");
	this.hdr=t_creator("c_hdr");
	/*ORIGINAL
	this.hdr.style.marginRight="20px";
	this.hdr.style.paddingRight="20px";
	*/
	
	this.objBox=document.createElement("DIV");
	this.objBox.style.width="100%";
	this.objBox.style.overflow="auto";
	this.objBox.appendChild(this.obj);
	this.objBox.className="objbox";
	
	if (dhtmlx.$customScroll)
		dhtmlx.CustomScroll.enable(this);
	
	this.hdrBox=document.createElement("DIV");
	/*ORIGINAL
	this.hdrBox.style.width="100%"
	this.hdrBox.style.height="25px";
	this.hdrBox.style.overflow="hidden";
	 */
	this.hdrBox.className="xhdr";
	
	
	this.preloadImagesAr=new Array(0)
	
	this.sortImg=document.createElement("DIV")
	this.sortImg.style.display="none";
	
	this.hdrBox.appendChild(this.sortImg)
	this.hdrBox.appendChild(this.hdr);
	this.hdrBox.style.position="relative";
	
	this.entBox.appendChild(this.hdrBox);
	this.entBox.appendChild(this.objBox);
	
	//add links to current object
	this.entBox.grid=this;
	this.objBox.grid=this;
	this.hdrBox.grid=this;
	this.obj.grid=this;
	this.hdr.grid=this;
	
	/*PROPERTIES*/
	this.cellWidthPX=[];                      //current width in pixels
	this.cellWidthPC=[];                      //width in % if cellWidthType set in pc
	this.cellWidthType=this.entBox.cellwidthtype||"px"; //px or %
	
	this.delim=this.entBox.delimiter||",";
	this._csvDelim=",";
	
	this.hdrLabels=[];
	this.columnIds=[];
	this.columnColor=[];
	this._hrrar=[];
	this.cellType=dhtmlxArray();
	this.cellAlign=[];
	this.initCellWidth=[];
	this.fldSort=[];
	this._srdh=(_isIE && (document.compatMode != "BackCompat") ? 22 : 20);
	this.imgURL=window.dhx_globalImgPath||""; 
	this.isActive=false; //fl to indicate if grid is in work now
	this.isEditable=true;
	this.useImagesInHeader=false; //use images in header or not
	this.pagingOn=false;          //paging on/off
	this.rowsBufferOutSize=0;     //number of rows rendered at a moment
	/*EVENTS*/
	dhtmlxEvent(window, "unload", function(){
			try{
				if (self.destructor) self.destructor();
			}
			catch (e){}
	});
	
	/*XML LOADER(S)*/
	/**
	*   @desc: set one of predefined css styles (xp, mt, gray, light, clear, modern)
	*   @param: name - style name
	*   @type: public
	*   @topic: 0,6
	*/
	this.setSkin=function(name){
		/*HSITX
		this._srdh=window.dhx4.readFromCss("dhxgrid_rh_"+name)+4;
		*/
		this.skin_name=name;
		if (this._imgURL)
			this.setImagePath(this._imgURL);
		
		var classname = this.entBox.className.split(" gridbox")[0];
		this.entBox.className=classname + " gridbox gridbox_"+name+(_isIE?" isIE":" isModern");
		this.skin_h_correction=0;
		
		//#alter_css:06042008{		
		this.enableAlterCss("ev_"+name, "odd_"+name, this.isTreeGrid())
		this._fixAlterCss()
		//#}
		switch (name){
		case "dhx_terrace":
		case "material":
			this._srdh=33;
			this.forceDivInHeader=true;
			break;
			
		case "dhx_web":
		case "material":
			this.forceDivInHeader=true;
			this._srdh = 31;
			break;
			
		case "dhx_skyblue":
			this.forceDivInHeader=true;
			break;
		}
		
		if (_isIE&&this.hdr){
			var d = this.hdr.parentNode;
			d.removeChild(this.hdr);
			d.appendChild(this.hdr);
		}
		this.setSizes();
	}
	
	if (_isIE)
		this.preventIECaching(true);
	if (window.dhtmlDragAndDropObject)
		this.dragger=new dhtmlDragAndDropObject();
	
	/*METHODS. SERVICE*/
	/**
	*   @desc: on scroll grid inner actions
	*   @type: private
	*   @topic: 7
	*/
	this._doOnScroll=function(e, mode){
		/*ORIGINAL
		this.callEvent("onScroll", [
			this.objBox.scrollLeft,
			this.objBox.scrollTop
		]);
		this.doOnScroll(e, mode);
		*/
		
		/*HSITX*/
		var box		= this.objBox	|| this;
		var grid	= box.grid;
		grid.callEvent("onScroll", [
			box.scrollLeft,
			box.scrollTop
		]);
		grid.doOnScroll(e, mode);
		/**/
	}
	/**
	*   @desc: on scroll grid more inner action
	*   @type: private
	*   @topic: 7
	*/
	this.doOnScroll=function(e, mode){
		var box = this.hdrBox;
		box._try_header_sync = true;
		setTimeout(function(){
			box._try_header_sync = false;
		},2000);
		
		this.hdrBox.scrollLeft=this.objBox.scrollLeft;
		if (this.ftr)
			this.ftr.parentNode.scrollLeft=this.objBox.scrollLeft;
		
		if (mode)
			return;
		
		if (this._srnd){
			/*
			if (this._dLoadTimer)
				window.clearTimeout(this._dLoadTimer);
			this._dLoadTimer=window.setTimeout(function(){
					if (self._update_srnd_view)
						self._update_srnd_view();
			}, 30);
			*/
			/*HSITX*/
			if(self._update_srnd_view){
                self._update_srnd_view();
            }
			/**/
		}
	}
	/**
	*   @desc: attach grid to some object in DOM
	*   @param: obj - object to attach to
	*   @type: public
	*   @topic: 0,7
	*/
	this.attachToObject=function(obj){
		obj.appendChild(this.globalBox?this.globalBox:this.entBox);
		//this.objBox.style.height=this.entBox.style.height;
		this.setSizes();
	}
	/**
	*   @desc: initialize grid
	*   @param: fl - if to parse on page xml data island 
	*   @type: public
	*   @topic: 0,7
	*/
	this.init=function(fl){
		if ((this.isTreeGrid())&&(!this._h2)){
			this._h2=this._createHierarchy();
			
			if ((this._fake)&&(!this._realfake))
				this._fake._h2=this._h2;
			this._tgc={
				imgURL: null
			};
		}
		
		if (!this._hstyles)
			return;
		
		if (!this.skin_name)
			this.setSkin(window.dhx4.skin||(typeof(dhtmlx)!="undefined"?dhtmlx.skin:null)||window.dhx4.skinDetect("dhxgrid")||"material");
		
		this.editStop()
		/*TEMPORARY STATES*/
		this.lastClicked=null;                //row clicked without shift key. used in multiselect only
		this.resized=null;                    //hdr cell that is resized now
		this.fldSorted=this.r_fldSorted=null; //hdr cell last sorted
		//empty grid if it already was initialized
		this.cellWidthPX=[];
		this.cellWidthPC=[];
		
		if (this.hdr.rows.length > 0){
			var temp = this.xmlFileUrl;
			this.clearAll(true);
			this.xmlFileUrl = temp;
		}
		
		var hdrRow = this.hdr.insertRow(0);
		
		for (var i = 0; i < this.hdrLabels.length; i++){
			hdrRow.appendChild(document.createElement("TH"));
			hdrRow.childNodes[i]._cellIndex=i;
			hdrRow.childNodes[i].style.height="0px";
		}
		
		if (_isIE && _isIE<8 && document.body.style.msTouchAction == this.undefined)
			hdrRow.style.position="absolute";
		else
			hdrRow.style.height='auto';
		
		var hdrRow = this.hdr.insertRow(_isKHTML ? 2 : 1);
		
		hdrRow._childIndexes=new Array();
		var col_ex = 0;
		
		for (var i = 0; i < this.hdrLabels.length; i++){
			hdrRow._childIndexes[i]=i-col_ex;
			
			if ((this.hdrLabels[i] == this.splitSign)&&(i != 0)){
				if (_isKHTML)
					hdrRow.insertCell(i-col_ex);
				hdrRow.cells[i-col_ex-1].colSpan=(hdrRow.cells[i-col_ex-1].colSpan||1)+1;
				hdrRow.childNodes[i-col_ex-1]._cellIndex++;
				col_ex++;
				hdrRow._childIndexes[i]=i-col_ex;
				continue;
			}
			
			hdrRow.insertCell(i-col_ex);
			
			hdrRow.childNodes[i-col_ex]._cellIndex=i;
			hdrRow.childNodes[i-col_ex]._cellIndexS=i;
			this.setColumnLabel(i, this.hdrLabels[i]);
		}
		
		if (col_ex == 0)
			hdrRow._childIndexes=null;
		this._cCount=this.hdrLabels.length;
		
		if (_isIE)
		window.setTimeout(function(){
				if (self.setSizes)
					self.setSizes();
		}, 1);
		
		//create virtual top row
		if (!this.obj.firstChild)
			this.obj.appendChild(document.createElement("TBODY"));
		
		var tar = this.obj.firstChild;
		
		if (!tar.firstChild){
			tar.appendChild(document.createElement("TR"));
			tar=tar.firstChild;
			
			if (_isIE && _isIE<8 && document.body.style.msTouchAction == this.undefined)
				tar.style.position="absolute";
			else
				tar.style.height='auto';
			
			for (var i = 0; i < this.hdrLabels.length; i++){
				tar.appendChild(document.createElement("TH"));
				tar.childNodes[i].style.height="0px";
			}
		}
		
		this._c_order=null;
		
		/*ORIGINAL
		if (this.multiLine != true)
			this.obj.className+=" row20px";
		*/
		
		//
		//this.combos = new Array(this.hdrLabels.length);
		//set sort image to initial state
		this.sortImg.style.position="absolute";
		this.sortImg.style.display="none";
		this.sortImg.className = "dhxgrid_sort_desc";
		this.sortImg.defLeft=0;
		
		if (this.noHeader){
			this.hdrBox.style.display='none';
		}
		else {
			this.noHeader=false
		}
		//#__pro_feature:21092006{
		//#column_hidden:21092006{
		if (this._ivizcol)
			this.setColHidden();
		//#}
		//#}
		//#header_footer:06042008{		
		this.attachHeader();
		this.attachHeader(0, 0, "_aFoot");
		//#}
		this.setSizes();
		
		if (fl)
			this.parseXML()
		this.obj.scrollTop=0
		
		if (this.dragAndDropOff)
			this.dragger.addDragLanding(this.entBox, this);
		
		if (this._initDrF)
			this._initD();
		
		dhx4.callEvent("onGridCreated", [this]);
	};
	
	this.setColumnSizes=function(gridWidth){
		/*ORIGINAL
		var summ = 0;
		var fcols = []; //auto-size columns
		
		var fix = 0;
		for (var i = 0; i < this._cCount; i++){
			if ((this.initCellWidth[i] == "*") && !this._hrrar[i]){
				this._awdth=false; //disable auto-width
				fcols.push(i);
				continue;
			}
			
			if (this.cellWidthType == '%'){
				if (typeof this.cellWidthPC[i]=="undefined")
					this.cellWidthPC[i]=this.initCellWidth[i];
				var cwidth = (gridWidth*this.cellWidthPC[i]/100)||0;
				if (fix>0.5){
					cwidth++;
					fix--;
				}
				var rwidth = this.cellWidthPX[i]=Math.floor(cwidth);
				var fix =fix + cwidth - rwidth;
			} else{
				if (typeof this.cellWidthPX[i]=="undefined")
					this.cellWidthPX[i]=this.initCellWidth[i];
			}
			if (!this._hrrar[i])
				summ+=this.cellWidthPX[i]*1;
		}
		
		//auto-size columns
		if (fcols.length){
			var ms = Math.floor((gridWidth-summ)/fcols.length);
			if (ms < 0) ms=1;
			
			for (var i = 0; i < fcols.length; i++){
				var next=Math.max((this._drsclmW ? (this._drsclmW[fcols[i]]||0) : 0),ms)
				this.cellWidthPX[fcols[i]]=next;
				summ+=next;
			}
			
			if(gridWidth > summ){
				var last=fcols[fcols.length-1];
				this.cellWidthPX[last]=this.cellWidthPX[last] + (gridWidth-summ);
				summ = gridWidth;
			}
			
			this._setAutoResize();
		}
		
		this.obj.style.width=summ+"px";
		this.hdr.style.width=summ+"px";
		if (this.ftr) this.ftr.style.width=summ+"px";
		
		this.chngCellWidth();
		return summ;
		*/
		
		/*HSITX*/
		if(xui.valid.isEmpty(this.element)){
			return 0;
		}
		var gridConfig	= this.element.gridController.config;
		var colModel	= gridConfig.colModel;
		var globalWidth	= 0;
		var summ		= 0;
		var fix			= 0;
		var cellWidth	= 0;
		if(gridConfig.freezeColumnIdx >= 0){
			if(gridWidth === 0){
				globalWidth	= (this.globalBox ? this.globalBox.offsetWidth : this.element.offsetWidth);
				for(var i = 0; i <= gridConfig.freezeColumnIdx; i++){
					if(i < gridConfig.plusIdx){
						if(gridConfig.ratio){
							cellWidth += (globalWidth*3/100);
						}else{
							cellWidth += 40;
						}
					}else{
						if(gridConfig.ratio){
							cellWidth	+= (globalWidth*parseFloat(colModel[i - gridConfig.plusIdx].width)/100);
						}else{
							cellWidth	+= colModel[i - gridConfig.plusIdx].width;
						}
					}
				}
				gridWidth = cellWidth > 0 ? Math.round(cellWidth) : 0;
			}else if(!this._realfake){
				globalWidth	= (this.globalBox ? this.globalBox.offsetWidth : this.element.offsetWidth);
				for(var i = gridConfig.freezeColumnIdx + 1; i < this._cCount; i++){
					if(gridConfig.ratio){
						cellWidth	+= (globalWidth*parseFloat(colModel[i - gridConfig.plusIdx].width)/100);
					}else{
						cellWidth	+= colModel[i - gridConfig.plusIdx].width;
					}
				}
				gridWidth = cellWidth > 0 ? Math.round(cellWidth) : 0;
			}
		}
		for(var i = 0; i < this._cCount; i++){
			if(gridConfig.freezeColumnIdx >= 0){
				if(this.cellWidthPX.length <= gridConfig.freezeColumnIdx + 1){
					if(gridConfig.ratio){
						if(typeof(this.cellWidthPC[i]) === "undefined"){
							this.cellWidthPC[i] = this.initCellWidth[i];
						}
						var cwidth = 0;
						if(i < gridConfig.plusIdx){
							cwidth = (gridWidth*3/gridConfig.totalFreezeWidth);
						}else{
							cwidth = (gridWidth * parseFloat(colModel[i - gridConfig.plusIdx].width) / gridConfig.totalFreezeWidth);
						}
						if(fix > 0.5){
							cwidth++;
							fix--;
						}
						var rwidth	= this.cellWidthPX[i] = Math.floor(cwidth) + (i === this._cCount - 1 ? 1 : 0);
						var fix		= fix + cwidth - rwidth;
					}else{
						if(typeof this.cellWidthPX[i] === "undefined"){
							this.cellWidthPX[i] = this.initCellWidth[i];
						}
						this.cellWidthPX[i] = this.initCellWidth[i];
					}
				}else{
					if(gridConfig.ratio){
						if(typeof(this.cellWidthPC[i]) === "undefined"){
							this.cellWidthPC[i] = this.initCellWidth[i];
						}
						var cwidth = (gridWidth * parseFloat(this.cellWidthPC[i]) / gridConfig.totalUnfreezeWidth);
						if(fix > 0.5){
							cwidth++;
							fix--;
						}
						var rwidth	= this.cellWidthPX[i]=Math.floor(cwidth);
						var fix		= fix + cwidth - rwidth;
					}else{
						if(typeof this.cellWidthPX[i] === "undefined"){
							this.cellWidthPX[i] = this.initCellWidth[i];
						}
					}
				}
			}else{
				if(gridConfig.ratio){
					if(typeof(this.cellWidthPC[i]) === "undefined"){
						this.cellWidthPC[i] = this.initCellWidth[i];
					}
					var cwidth = (gridWidth * parseFloat(this.cellWidthPC[i]) / 100);
					if(fix > 0.5){
						cwidth++;
						fix--;
					}
					var rwidth	= this.cellWidthPX[i]=Math.floor(cwidth);
					var fix		= fix + cwidth - rwidth;
				}else{
					if(typeof this.cellWidthPX[i] === "undefined"){
						this.cellWidthPX[i] = this.initCellWidth[i];
					}
				}
			}
			if (!this._hrrar[i])
				summ+=this.cellWidthPX[i]*1;
		}
		this.obj.style.width=summ+"px";
		this.hdr.style.width=summ+"px";
		if (this.ftr) this.ftr.style.width=summ+"px";
		this.chngCellWidth();
		return summ;
		/**/
	}
	
	/**shz)_
	*   @desc: sets sizes of grid elements
	*   @type: private
	*   @topic: 0,7
	*/
	this.setSizes=function(){
		//drop processing if grid still not initialized
		if ((!this.hdr.rows[0])) return;
		
		var quirks=this.quirks = (_isIE && document.compatMode=="BackCompat");
		var outerBorder=(this.entBox.offsetWidth-this.entBox.clientWidth)/2;
		
		if (!this.dontSetSizes){
			if (this.globalBox){
				if (!this.globalBox.clientWidth) return;
				var ow = this.globalBox.clientWidth;
				var splitOuterBorder=(this.globalBox.offsetWidth-ow)/2;
				if (this._delta_x && !this._realfake){
					this.globalBox.style.width=this._delta_x;
					this.globalBox.style.boxSizing = "border-box";
					var owu = this.globalBox.clientWidth;
					this.entBox.style.width=Math.max(0,(owu+(quirks?splitOuterBorder*2:0))-this._fake.entBox.clientWidth)+"px";
					if (owu != this._lastTimeSplitWidth){
						this._fake._correctSplit(this._fake.entBox.clientWidth);
						this._lastTimeSplitWidth = owu;
					}
				}
				if (this._delta_y && !this._realfake){
					this.globalBox.style.height = this._delta_y;
					this.entBox.style.overflow = this._fake.entBox.style.overflow="hidden";
					this.entBox.style.height = this._fake.entBox.style.height=this.globalBox.clientHeight+(quirks?splitOuterBorder*2:0)+"px";
				}
			} else {
				if (this._delta_x){
					//when placed directly in TD tag, container can't use native percent based sizes, because table auto-adjust to show all content - too clever
					if (this.entBox.parentNode && this.entBox.parentNode.tagName=="TD"){
						this.entBox.style.width="1px";
						this.entBox.style.width=parseInt(this._delta_x)*this.entBox.parentNode.clientWidth/100-outerBorder*2+"px";
					}else
					this.entBox.style.width=this._delta_x;
				}
				if (this._delta_y)
					this.entBox.style.height=this._delta_y;
			}
		}
		
		//if we have container without sizes, wait untill sizes defined
		window.clearTimeout(this._sizeTime);		
		if (!this.entBox.offsetWidth && (!this.globalBox || !this.globalBox.offsetWidth)){
			this._sizeTime=window.setTimeout(function(){
					if (self.setSizes)
						self.setSizes();
			}, 250);
			return;
		}		
		
		var border_x = ((!this._wthB) && ((this.entBox.cmp||this._delta_x) && ((this.skin_name||"").indexOf("dhx")==0 || this.skin_name == "material") && !quirks)?2:0);
		var border_y = ((!this._wthB) && ((this.entBox.cmp||this._delta_y) && ((this.skin_name||"").indexOf("dhx")==0 || this.skin_name == "material") && !quirks)?2:0);
		
		if (this._sizeFix){
			border_x -= this._sizeFix;
			border_y -= this._sizeFix;
		}
		
		var isVScroll = this.parentGrid?false:(this.objBox.scrollHeight > this.objBox.offsetHeight);
		
        isVScroll = false;
		
		var scrfix = dhtmlx.$customScroll?0:18;
		
		var gridWidth=this.entBox.clientWidth-(this.skin_h_correction||0)*(quirks?0:1)-border_x;
		var gridWidthActive=this.entBox.clientWidth-(this.skin_h_correction||0)-border_x;
		
		/*ORIGINAL*/
		//var gridHeight=this.entBox.clientHeight-border_y;
		/*ORIGINAL*/
		/*HSTIX*/
		// 2023.08.02 임시 추가
		var gridHeight=this.entBox.offsetHeight-border_y;
		/*HSTIX*/
		var summ=this.setColumnSizes(gridWidthActive-(isVScroll?scrfix:0)-(this._correction_x||0));
		
		var isHScroll = this.parentGrid?false:((this.objBox.scrollWidth > this.objBox.offsetWidth)||(this.objBox.style.overflowX=="scroll"));
		/*ORIGINAL*/
		/*
		var headerHeight = this.hdr.clientHeight;
		var footerHeight = this.ftr?this.ftr.clientHeight:0;
		*/
		/*ORIGINAL*/
		
		/*HSTIX*/
		var headerHeight	= this.hdr.clientHeight;
		var footerHeight	= this.ftr?this.ftr.clientHeight:0;
		// 2022.11.28 임시 추가
		if(typeof(this.element) !== "undefined" && !this.element.gridController.config.enableAutoHeight){
			headerHeight	= this.element.gridController.config.headerHeight * this.element.gridController.config.headerLineSize;
			footerHeight	= this.element.gridController.config.footerHeight;
		}
		/*HSTIX*/
		
		var newWidth=gridWidth;
		var newHeight=gridHeight-headerHeight-footerHeight;
		
		//if we have auto-width without limitations - ignore h-scroll
		if (this._awdth && this._awdth[0] && this._awdth[1]==99999) isHScroll=0;
		//auto-height
		if (this._ahgr){
			if (this._ahgrMA)
				newHeight=this.entBox.parentNode.clientHeight-headerHeight-footerHeight;
			else
				newHeight=this.obj.offsetHeight+(isHScroll?scrfix:0)+(this._correction_y||0);
			
			if (this._ahgrM){
				if (this._ahgrF) 
					newHeight=Math.min(this._ahgrM,newHeight+headerHeight+footerHeight)-headerHeight-footerHeight;
				else 
					newHeight=Math.min(this._ahgrM,newHeight);
				
			}
			if (isVScroll && newHeight>=this.obj.scrollHeight+(isHScroll?scrfix:0)){
				isVScroll=false;//scroll will be compensated;
				this.setColumnSizes(gridWidthActive-(this._correction_x||0)); //correct auto-size columns
			}
		}
		
		//auto-width
		if ((this._awdth)&&(this._awdth[0])){ 
			//convert percents to PX, because auto-width with procents has no sense
			if (this.cellWidthType == '%') this.cellWidthType="px";
			
			if (this._fake) summ+=this._fake.entBox.clientWidth;	//include fake grid in math
			var newWidth=Math.min(Math.max(summ+(isVScroll?scrfix:0),this._awdth[2]),this._awdth[1])+(this._correction_x||0);
			this.objBox.style.overflowX = (!isVScroll && this.objBox.scrollWidth <= newWidth)?"hidden":"auto";
			if (this._fake) newWidth-=this._fake.entBox.clientWidth;
		}
		
		newHeight=Math.max(0,newHeight);//validate value for IE
		
		//FF3.1, bug in table rendering engine
		this._ff_size_delta=(this._ff_size_delta==0.1)?0.2:0.1;
		if (!_isFF) this._ff_size_delta=0;
		
		if (!this.dontSetSizes){
			this.entBox.style.width=Math.max(0,newWidth+(quirks?2:0)*outerBorder+this._ff_size_delta)+"px";
			this.entBox.style.height=newHeight+(quirks?2:0)*outerBorder+headerHeight+footerHeight+"px";
		}
		/*ORIGINAL
		this.objBox.style.height=newHeight+((quirks&&!isVScroll)?2:0)*outerBorder+"px";//):this.entBox.style.height);
		*/
		this.hdrBox.style.height=headerHeight+"px";		
		
		if (newHeight != gridHeight)
			this.doOnScroll(0, !this._srnd);
		var ext=this["setSizes_"+this.skin_name];
		if (ext) ext.call(this);
		
		this.setSortImgPos();	
		//it possible that changes of size, has changed header height 
		if (headerHeight != this.hdr.clientHeight && this._ahgr) 	
			this.setSizes();
		this.callEvent("onSetSizes",[]);
	};
	/**
	*   @desc: changes cell width
	*   @param: [ind] - index of row in grid
	*   @type: private
	*   @topic: 4,7
	*/
	this.chngCellWidth=function(){
		if ((_isOpera)&&(this.ftr))
			this.ftr.width=this.objBox.scrollWidth+"px";
		var l = this._cCount;
		
		for (var i = 0; i < l; i++){
			this.hdr.rows[0].cells[i].style.width=this.cellWidthPX[i]+"px";
			this.obj.rows[0].childNodes[i].style.width=this.cellWidthPX[i]+"px";
			
			if (this.ftr)
				this.ftr.rows[0].cells[i].style.width=this.cellWidthPX[i]+"px";
		}
	}
	/**
	*   @desc: set delimiter character used in list values (default is ",")
	*   @param: delim - delimiter as string
	*   @before_init: 1
	*   @type: public
	*   @topic: 0
	*/
	this.setDelimiter=function(delim){
		this.delim=delim;
	}
	/**
	*   @desc: set width of columns in percents
	*   @type: public
	*   @before_init: 1
	*   @param: wp - list of column width in percents
	*   @topic: 0,7
	*/
	this.setInitWidthsP=function(wp){
		this.cellWidthType="%";
		this.initCellWidth=wp.split(this.delim.replace(/px/gi, ""));
		if (!arguments[1]) this._setAutoResize();
	}
	/**
	*	@desc:
	*	@type: private
	*	@topic: 0
	*/
	this._setAutoResize=function(){
		if (this._realfake) return;
		var el = window;
		var self = this;
		
		dhtmlxEvent(window,"resize",function(){
			window.clearTimeout(self._resize_timer);
			if (self._setAutoResize)
			self._resize_timer=window.setTimeout(function(){
				/*ORIGINAL
					if (self.setSizes)
						self.setSizes();
					if (self._fake)
						self._fake._correctSplit();
				*/
				/*HSITX*/
				if(self._fake){
					self._fake._correctSplit();
				}
				if(self.setSizes){
					self.setSizes();
				}
				/**/
			}, 100);
		});

		//prevent multiple initializations
		this._setAutoResize = function(){};
	}
	
	
	/**
	*   @desc: set width of columns in pixels
	*   @type: public
	*   @before_init: 1
	*   @param: wp - list of column width in pixels
	*   @topic: 0,7
	*/
	this.setInitWidths=function(wp){
		this.cellWidthType="px";
		this.initCellWidth=wp.split(this.delim);
		
		if (_isFF){
			for (var i = 0; i < this.initCellWidth.length; i++)
				if (this.initCellWidth[i] != "*")
				this.initCellWidth[i]=parseInt(this.initCellWidth[i]);
		}
	}
	
	/**
	*   @desc: set multiline rows support to enabled or disabled state
	*   @type: public
	*   @before_init: 1
	*   @param: state - true or false
	*   @topic: 0,7
	*/
	this.enableMultiline=function(state){
		this.multiLine=dhx4.s2b(state);
	}
	
	/**
	*   @desc: set multiselect mode to enabled or disabled state
	*   @type: public
	*   @param: state - true or false
	*   @topic: 0,7
	*/
	this.enableMultiselect=function(state){
		this.selMultiRows=dhx4.s2b(state);
	}
	
	/**
	*   @desc: set path to grid internal images (sort direction, any images used in editors, checkbox, radiobutton)
	*   @type: public
	*   @param: path - url (or relative path) of images folder with closing "/"
	*   @topic: 0,7
	*/
	this.setImagePath=function(path){
		path = path.replace(/imgs\/dhxgrid_[a-z]*\/$/,"imgs/");
		this._imgURL= path;
		this.imgURL = path + "dhxgrid_"+(this.skin_name || "dhx_skyblue").replace("dhx_", "") + "/";
		this.iconTree = this.imgURL + "tree/";
	}
	this.setImagesPath=this.setImagePath;
	/**
	*   @desc: set path to external images used in grid ( tree and img column types )
	*   @type: public
	*   @param: path - url (or relative path) of images folder with closing "/"
	*   @topic: 0,7
	*/
	this.setIconPath=function(path){
		this.iconURL=path;
	}	
	this.setIconsPath=this.setIconPath;
	//#column_resize:06042008{
	/**
	*   @desc: part of column resize routine
	*   @type: private
	*   @param: ev - event
	*   @topic: 3
	*/
	this.changeCursorState=function(ev){
		var el = ev.target||ev.srcElement;
		
		if (el.tagName != "TD")
			el=this.getFirstParentOfType(el, "TD")
		if (!el) return;
		if ((el.tagName == "TD")&&(this._drsclmn)&&(!this._drsclmn[el._cellIndex]))
			return el.style.cursor="default";
		var check = (ev.layerX||0)+(((!_isIE)&&(ev.target.tagName == "DIV")) ? el.offsetLeft : 0);
		if ((el.offsetWidth-(ev.offsetX||(parseInt(this.getPosition(el, this.hdrBox))-check)*-1)) < (_isOpera?20:10)){
			el.style.cursor="E-resize";
		}
		else{
			el.style.cursor="default";
		}
		
		if (_isOpera)
			this.hdrBox.scrollLeft=this.objBox.scrollLeft;
	}
	/**
	*   @desc: part of column resize routine
	*   @type: private
	*   @param: ev - event
	*   @topic: 3
	*/
	this.startColResize=function(ev){
		if (this.resized) this.stopColResize();
		this.resized=null;
		var el = ev.target||ev.srcElement;
		if (el.tagName != "TD")
			el=this.getFirstParentOfType(el, "TD")
		var x = ev.clientX;
		var tabW = this.hdr.offsetWidth;
		var startW = parseInt(el.offsetWidth)
		
		if (el.tagName == "TD"&&el.style.cursor != "default"){
			if ((this._drsclmn)&&(!this._drsclmn[el._cellIndex]))
				return;
			
			self._old_d_mm=document.body.onmousemove;
			self._old_d_mu=document.body.onmouseup;
			
			document.body.onmousemove=function(e){
				if (self)
					self.doColResize(e||window.event, el, startW, x, tabW)
			}
			document.body.onmouseup=function(){
				if (self)
					self.stopColResize();
			}
		}
	}
	/**
	*   @desc: part of column resize routine
	*   @type: private
	*   @param: ev - event
	*   @topic: 3
	*/
	this.stopColResize=function(){ 
		document.body.onmousemove=self._old_d_mm||"";
		document.body.onmouseup=self._old_d_mu||"";
		this.setSizes();
		this.doOnScroll(0, 1)
		this.callEvent("onResizeEnd", [this]);
	}
	/**
	*   @desc: part of column resize routine
	*   @param: el - element (column resizing)
	*   @param: startW - started width
	*   @param: x - x coordinate to resize from
	*   @param: tabW - started width of header table
	*   @type: private
	*   @topic: 3
	*/
	this.doColResize=function(ev, el, startW, x, tabW){
		el.style.cursor="E-resize";
		
		this.resized=el;
		var fcolW = startW+(ev.clientX-x);
		var wtabW = tabW+(ev.clientX-x)
		
		if (!(this.callEvent("onResize", [
				el._cellIndex,
			fcolW,
			this
		])))
		return;
		
		if (_isIE)
			this.objBox.scrollLeft=this.hdrBox.scrollLeft;
		
		var result = false;
		if (el.colSpan > 1){
			var a_sizes = new Array();
			
			for (var i = 0;
				i < el.colSpan;
				i++)a_sizes[i]=Math.round(fcolW*this.hdr.rows[0].childNodes[el._cellIndexS+i].offsetWidth/el.offsetWidth);
				
				for (var i = 0; i < el.colSpan; i++)
					result = this._setColumnSizeR(el._cellIndexS+i*1, a_sizes[i]);
		} else
		result = this._setColumnSizeR(el._cellIndex, fcolW);
		this.doOnScroll(0, 1);
		
		this.setSizes();
		if (this._fake && this._awdth) this._fake._correctSplit();
		
		return result;
	}
	
	/**
	*   @desc: set width of grid columns ( zero row of header and body )
	*   @type: private
	*   @topic: 7
	*/
	this._setColumnSizeR=function(ind, fcolW){
		if (fcolW > ((this._drsclmW&&!this._notresize) ? (this._drsclmW[ind]||10) : 10)){
			this.obj.rows[0].childNodes[ind].style.width=fcolW+"px";
			this.hdr.rows[0].childNodes[ind].style.width=fcolW+"px";
			
			if (this.ftr)
				this.ftr.rows[0].childNodes[ind].style.width=fcolW+"px";
			
			if (this.cellWidthType == 'px'){
				this.cellWidthPX[ind]=fcolW;
			}
			else {
				var gridWidth = parseInt(this.entBox.offsetWidth);
				
				if (this.objBox.scrollHeight > this.objBox.offsetHeight)
					gridWidth-=17;
				var pcWidth = Math.round(fcolW / gridWidth*100)
				this.cellWidthPC[ind]=pcWidth;
			}
			if (this.sortImg.style.display!="none")
				this.setSortImgPos();
		} else return false;
	}
	//#}
	//#sorting:06042008{
	/**
	*    @desc: sets position and visibility of sort arrow
	*    @param: state - true/false - show/hide image
	*    @param: ind - index of field
	*    @param: order - asc/desc - type of image
	*    @param: row - one based index of header row ( used in multirow headers, top row by default )
	*   @type: public
	*   @topic: 7
	*/
	this.setSortImgState=function(state, ind, order, row){
		order=(order||"asc").toLowerCase();
		
		if (!dhx4.s2b(state)){
			this.sortImg.style.display="none";
			/*ORIGINAL
			if (this.r_fldSorted)
				this.r_fldSorted.className = "";
			*/
			/*HSITX*/
			if(this.r_fldSorted){
				this.r_fldSorted.className	= "xuihcell_sort";
			}
			/**/
			this.fldSorted=this.r_fldSorted = null;
			return;
		}
		
		if (order == "asc")
			this.sortImg.className = "dhxgrid_sort_asc";
		else
			this.sortImg.className = "dhxgrid_sort_desc";
		
		this.sortImg.style.display="";
		this.fldSorted=this.hdr.rows[0].childNodes[ind];
		var r = this.hdr.rows[row||1];
		if (!r) return;
		
		for (var i = 0; i < r.childNodes.length; i++){
			if (r.childNodes[i]._cellIndexS == ind){
				this.r_fldSorted=r.childNodes[i];
				return  this.setSortImgPos();
			}
		}
		return this.setSortImgState(state,ind,order,(row||1)+1);
	}
	
	/**
	*    @desc: sets position and visibility of sort arrow
	*    @param: ind - index of field
	*    @param: ind - index of field
	*    @param: hRowInd - index of row in case of complex header, one-based, optional
	
	*   @type: private
	*   @topic: 7
	*/
	this.setSortImgPos=function(ind, mode, hRowInd, el){
		if (this._hrrar && this._hrrar[this.r_fldSorted?this.r_fldSorted._cellIndex:ind]) return;
		/*ORIGINAL
		if (this.ar_fldSorted)
			this.ar_fldSorted.className = "";
		*/
		/*HSITX*/
		if(this.ar_fldSorted){
			if(this.ar_fldSorted.classList.contains("xuihcell_sort")){
				this.ar_fldSorted.className	= "xuihcell_sort";
			}else{
				this.ar_fldSorted.className	= "";
			}
		}
		/**/

		if (!el){
			if (!ind)
				var el = this.r_fldSorted;
			else
				var el = this.hdr.rows[hRowInd||0].cells[ind];
		}
		
		if (el != null){
			var pos = this.getPosition(el, this.hdrBox)
			var wdth = el.offsetWidth;
			this.ar_fldSorted = el;
			/*ORIGINAL
			el.className = this.sortImg.className+"_col";
			*/
			/*HSITX*/
			el.className = this.sortImg.className + "_col xuihcell_sort";
			/**/

			this.sortImg.style.left=Number(pos[0]+wdth-13)+"px"; //Number(pos[0]+5)+"px";
			this.sortImg.defLeft=parseInt(this.sortImg.style.left)
			this.sortImg.style.top=Number(pos[1]+5)+"px";
			
			if ((!this.useImagesInHeader)&&(!mode))
				this.sortImg.style.display="inline";
			this.sortImg.style.left=this.sortImg.defLeft+"px"; //-parseInt(this.hdrBox.scrollLeft)
		}
	}
	//#}
	/**
	*   @desc: manage activity of the grid.
	*   @param: fl - true to activate,false to deactivate
	*   @type: private
	*   @topic: 1,7
	*/
	this.setActive=function(fl){
		if (arguments.length == 0)
			var fl = true;
		
		if (fl == true){
			//document.body.onkeydown = new Function("","document.getElementById('"+this.entBox.id+"').grid.doKey()")//
			if (globalActiveDHTMLGridObject&&(globalActiveDHTMLGridObject != this)){
				globalActiveDHTMLGridObject.editStop();
				globalActiveDHTMLGridObject.callEvent("onBlur",[globalActiveDHTMLGridObject]);
			}
			
			globalActiveDHTMLGridObject=this;
			this.isActive=true;
		} else {
			this.isActive=false;
			this.callEvent("onBlur",[this]);
		}
	};
	/**
	*     @desc: called on click occured
	*     @type: private
	*/
	this._doClick=function(ev){
		var selMethod = 0;
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");
		if (!el || !el.parentNode || !el.parentNode.idd) return;
		var fl = true;
		
		//mm
		//markers start
		if (this.markedCells){
			var markMethod = 0;
			
			if (ev.shiftKey||ev.metaKey){
				markMethod=1;
			}
			
			if (ev.ctrlKey){
				markMethod=2;
			}
			this.doMark(el, markMethod);
			return true;
		}
		//markers end
		//mm
		
		if (this.selMultiRows != false){
			if (ev.shiftKey && this.row != null && this.selectedRows.length){
				selMethod=1;
			}
			
			if (ev.ctrlKey||ev.metaKey){
				selMethod=2;
			}
		}
		return this.doClick(el, fl, selMethod, false)
	};
	
	//#context_menu:06042008{
	/**
	*   @desc: called onmousedown inside grid area
	*   @type: private
	*/
	this._doContClick=function(ev){ 
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");
		
		if ((!el)||( typeof (el.parentNode.idd) == "undefined")){
			this.callEvent("onEmptyClick", [ev]);
			return true;
		}
		
		if (ev.button == 2||(_isMacOS&&ev.ctrlKey)){
			if (!this.callEvent("onRightClick", [
					el.parentNode.idd,
				el._cellIndex,
				ev
			])){
			var z = function(e){
				(e||event).cancelBubble=true;
				return false;
			};
			
			(ev.srcElement||ev.target).oncontextmenu=z;
			return z(ev);
			}
			
			if (this._ctmndx){
				if (!(this.callEvent("onBeforeContextMenu", [
						el.parentNode.idd,
					el._cellIndex,
					this
				])))
				return true;
				
				if (_isIE)
				ev.srcElement.oncontextmenu=function(){
					event.cancelBubble=true;
					return false;
				};
				
				if (this._ctmndx.showContextMenu){
					
					var dEl0=window.document.documentElement;
					var dEl1=window.document.body;
					var corrector = new Array((dEl0.scrollLeft||dEl1.scrollLeft),(dEl0.scrollTop||dEl1.scrollTop));
					if (_isIE){
						var x= ev.clientX+corrector[0];
						var y = ev.clientY+corrector[1];
					} else {
						var x= ev.pageX;
						var y = ev.pageY;
					}
					this._ctmndx.showContextMenu(x-1,y-1)
					this.contextID=this._ctmndx.contextMenuZoneId=el.parentNode.idd+"_"+el._cellIndex;
					this._ctmndx._skip_hide=true;
				} else {
					el.contextMenuId=el.parentNode.idd+"_"+el._cellIndex;
					el.contextMenu=this._ctmndx;
					el.a=this._ctmndx._contextStart;
					el.a(el, ev);
					el.a=null;
				}
				ev.cancelBubble=true;
				return false;
			}
		}
		
		else if (this._ctmndx){
			if (this._ctmndx.hideContextMenu)
				this._ctmndx.hideContextMenu()
			else
				this._ctmndx._contextEnd();
		}
		return true;
	}
	//#}
	/**
	*    @desc: occures on cell click (supports treegrid)
	*   @param: [el] - cell to click on
	*   @param:   [fl] - true if to call onRowSelect function
	*   @param: [selMethod] - 0 - simple click, 1 - shift, 2 - ctrl
	*   @param: show - true/false - scroll row to view, true by defaul    
	*   @type: private
	*   @topic: 1,2,4,9
	*/
	this.doClick=function(el, fl, selMethod, show){
		if (!this.selMultiRows) selMethod=0; //block programmatical multiselecton if mode not enabled explitly
		var psid = this.row ? this.row.idd : 0;
		
		this.setActive(true);
		
		if (!selMethod)
			selMethod=0;
		
		if (this.cell != null)
			this.cell.className=this.cell.className.replace(/[ \t]*cellselected/g, "");
		
		if (el.tagName == "TD"){
			if (this.checkEvent("onSelectStateChanged"))
				var initial = this.getSelectedId();
			var prow = this.row;
			if (selMethod == 1){
				var elRowIndex = this.rowsCol._dhx_find(el.parentNode)
				var lcRowIndex = this.rowsCol._dhx_find(this.lastClicked)
				
				if (elRowIndex > lcRowIndex){
					var strt = lcRowIndex;
					var end = elRowIndex;
				} else {
					var strt = elRowIndex;
					var end = lcRowIndex;
				}
				
				for (var i = 0; i < this.rowsCol.length; i++)
				if ((i >= strt&&i <= end)){
					if (this.rowsCol[i]&&(!this.rowsCol[i]._sRow)){
						if (!this.rowsCol[i].idd) continue;
						if (this.rowsCol[i].className.indexOf("rowselected")
							== -1&& (this.callEvent("onBeforeSelect", [
									this.rowsCol[i].idd,
									psid,
									el._cellIndex
							]))){
						this.rowsCol[i].className+=" rowselected";
						this.selectedRows[this.selectedRows.length]=this.rowsCol[i]
							}
					} else {
						this.clearSelection();
						return this.doClick(el, fl, 0, show);
					}
				}
			} else if (selMethod == 2){
				if (el.parentNode.className.indexOf("rowselected") != -1){
					el.parentNode.className=el.parentNode.className.replace(/[ \t]*rowselected/g, "");
					this.selectedRows._dhx_removeAt(this.selectedRows._dhx_find(el.parentNode))
					var skipRowSelection = true;
					show = false;
				}
			}
			this.editStop()
			if (typeof (el.parentNode.idd) == "undefined")
				return true;
			
			if ((!skipRowSelection)&&(!el.parentNode._sRow)){
				if (this.callEvent("onBeforeSelect", [
						el.parentNode.idd,
					psid,
					el._cellIndex
				])){
				if (this.getSelectedRowId() != el.parentNode.idd){
					if (selMethod == 0)
						this.clearSelection();
					this.cell=el;
					if ((prow == el.parentNode)&&(this._chRRS))
						fl=false;
					this.row=el.parentNode;
					this.row.className+=" rowselected"
					
					if (this.selectedRows._dhx_find(this.row) == -1)
						this.selectedRows[this.selectedRows.length]=this.row;
				} else {
					this.cell=el;
					this.row = el.parentNode;
				}
				} else fl = false;
			}
			
			if (this.cell && this.cell.parentNode.className.indexOf("rowselected") != -1)
				this.cell.className=this.cell.className.replace(/[ \t]*cellselected/g, "")+" cellselected";
			
			if (selMethod != 1)
				if (!this.row)
				return;
			this.lastClicked=el.parentNode;
			
			var rid = this.row.idd;
			var cid = this.cell;
			
			if (fl&& typeof (rid) != "undefined" && cid && !skipRowSelection) {
				self.onRowSelectTime=setTimeout(function(){
						if (self.callEvent)
						self.callEvent("onRowSelect", [
								rid,
								cid._cellIndex
						]);
				}, 100);
			} else this.callEvent("onRowSelectRSOnly",[rid]);
			
			if (this.checkEvent("onSelectStateChanged")){
				var afinal = this.getSelectedId();
				
				if (initial != afinal)
					this.callEvent("onSelectStateChanged", [afinal,initial]);
			}
			
			if (skipRowSelection) return false;
		}
		this.isActive=true;
		if (show !== false && this.cell && this.cell.parentNode.idd)
			this.moveToVisible(this.cell)
	}
	
	/**
	*   @desc: select all rows in grid, it doesn't fire any events
	*   @param: edit - switch selected cell to edit mode
	*   @type: public
	*   @topic: 1,4
	*/
	this.selectAll=function(){
		this.clearSelection();
		
		var coll = this.rowsBuffer;
		//in paging mode, we select only current page
		if (this.pagingOn) coll = this.rowsCol;
		for (var i = 0; i<coll.length; i ++){
			this.render_row(i).className+=" rowselected";
		}
		
		this.selectedRows=dhtmlxArray([].concat(coll));
		
		if (this.selectedRows.length){
			this.row  = this.selectedRows[0];
			this.cell = this.row.cells[0];
		}
		
		if ((this._fake)&&(!this._realfake))
			this._fake.selectAll();
	}
	/**
	*   @desc: set selection to specified row-cell
	*   @param: r - row object or row index
	*   @param: cInd - cell index
	*   @param: [fl] - true if to call onRowSelect function
	*   @param: preserve - preserve previously selected rows true/false (false by default)
	*   @param: edit - switch selected cell to edit mode
	*   @param: show - true/false - scroll row to view, true by defaul         
	*   @type: public
	*   @topic: 1,4
	*/
	this.selectCell=function(r, cInd, fl, preserve, edit, show){
		if (!fl)
			fl=false;
		
		if (typeof (r) != "object")
			r=this.render_row(r)
		if (!r || r==-1) return null;
		//#__pro_feature:21092006{
		//#colspan:20092006{
		if (r._childIndexes)
			var c = r.childNodes[r._childIndexes[cInd]];
		else
			//#}
		//#}
		var c = r.childNodes[cInd];
		
		if (!c)
			c=r.childNodes[0];
		if(!this.markedCells){
			if (preserve)
				this.doClick(c, fl, 3, show)
			else
				this.doClick(c, fl, 0, show)
		}
		else 
			this.doMark(c,preserve?2:0);
		
		if (edit)
			this.editCell();
	}
	/**
	*   @desc: moves specified cell to visible area (scrolls)
	*   @param: cell_obj - object of the cell to work with
	*   @param: onlyVScroll - allow only vertical positioning
	
	*   @type: private
	*   @topic: 2,4,7
	*/
	this.moveToVisible=function(cell_obj, onlyVScroll){
		if (this.pagingOn){
			var newPage=Math.floor(this.getRowIndex(cell_obj.parentNode.idd) / this.rowsBufferOutSize)+1;
			if (newPage!=this.currentPage)
				this.changePage(newPage);
		}
		
		try{
			if (cell_obj.offsetHeight){
				var distance = cell_obj.offsetLeft+cell_obj.offsetWidth+20;
				
				var scrollLeft = 0;
				
				if (distance > (this.objBox.offsetWidth+this.objBox.scrollLeft)){
					if (cell_obj.offsetLeft > this.objBox.scrollLeft)
						scrollLeft= cell_obj.offsetLeft - (this.objBox.offsetWidth - cell_obj.offsetWidth) +5
				} else if (cell_obj.offsetLeft < this.objBox.scrollLeft){
					distance-=cell_obj.offsetWidth*2/3;
					if (distance < this.objBox.scrollLeft)
						scrollLeft=cell_obj.offsetLeft-5
				}
				
				if ((scrollLeft)&&(!onlyVScroll))
					this.objBox.scrollLeft=scrollLeft;
			}
			
			
			if (!cell_obj.offsetHeight){
				var mask=this._realfake?this._fake.rowsAr[cell_obj.parentNode.idd]:cell_obj.parentNode;
				distance = this.rowsBuffer._dhx_find(mask)*this._srdh;
			}
			else
				distance = cell_obj.offsetTop;
			var distancemax = distance + cell_obj.offsetHeight+38;

		    //220118HSITX : ROW이동시, 남아있는 공간이 없을 때 최상단으로 스크롤 옮기는 것을 주석처리.  
			if (distancemax > (this.objBox.offsetHeight+this.objBox.scrollTop)){
				var scrollTop = distance;
			} else if (distance < this.objBox.scrollTop){
				var scrollTop = distance-5
			}
			
			if (scrollTop){this.objBox.scrollTop=scrollTop;}
				
		}
		catch (er){}
	}
	/**
	*   @desc: creates Editor object and switch cell to edit mode if allowed
	*   @type: public
	*   @topic: 4
	*/
	this.editCell = function(){
		if (this.editor&&this.cell == this.editor.cell)
			return; //prevent reinit for same cell
		
		this.editStop();
		
		if ((this.isEditable != true)||(!this.cell))
			return false;
		var c = this.cell;
		
		//#locked_row:11052006{
		if (c.parentNode._locked)
			return false;
		//#}
		
		this.editor=this.cells4(c);
		
		//initialize editor
		if (this.editor != null){
			if (this.editor.isDisabled()){
				this.editor=null;
				return false;
			}
			
			if (this.callEvent("onEditCell", [
					0,
				this.row.idd,
				this.cell._cellIndex
			]) != false&&this.editor.edit){
			this._Opera_stop=(new Date).valueOf();
			c.className += " editable";
			this.editor.edit();
			this.callEvent("onEditCell", [
					1,
					this.row.idd,
					this.cell._cellIndex
			])
			} else { //preserve editing
				this.editor=null;
			}
		}
	}
	/**
	*   @desc: retuns value from editor(if presents) to cell and closes editor
	*   @mode: if true - current edit value will be reverted to previous one
	*   @type: public
	*   @topic: 4
	*/
	this.editStop=function(mode){
		if (_isOpera)
		if (this._Opera_stop){
			if ((this._Opera_stop*1+50) > (new Date).valueOf())
				return;
			
			this._Opera_stop=null;
		}
		
		if (this.editor&&this.editor != null){
			this.editor.cell.className=this.editor.cell.className.replace("editable", "");
			
			if (mode){
				var t = this.editor.val;
				this.editor.detach();
				this.editor.setValue(t);
				this.editor=null;
				
				this.callEvent("onEditCancel", [
						this.row.idd,
						this.cell._cellIndex,
						t
				]);
				return;
			}
			
			if (this.editor.detach())
				this.cell.wasChanged=true;
			
			var g = this.editor;
			if (g == null) return;
			
			this.editor=null;
			var z = this.callEvent("onEditCell", [
					2,
					this.row.idd,
					this.cell._cellIndex,
					g.getValue(),
					g.val
			]);
			
			if (( typeof (z) == "string")||( typeof (z) == "number"))
				g[g.setImage ? "setLabel" : "setValue"](z);
			
			else if (!z)
				g[g.setImage ? "setLabel" : "setValue"](g.val);
			
			if (this._ahgr && this.multiLine) this.setSizes();
		}
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this._nextRowCell=function(row, dir, pos){
		row=this._nextRow((this._groups?this.rowsCol:this.rowsBuffer)._dhx_find(row), dir);
		
		if (!row)
			return null;
		
		return row.childNodes[row._childIndexes ? row._childIndexes[pos] : pos];
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this._getNextCell=function(acell, dir, i){
		
		acell=acell||this.cell;
		
		var arow = acell.parentNode;
		
		if (this._tabOrder){
			i=this._tabOrder[acell._cellIndex];
			
			if (typeof i != "undefined")
				if (i < 0)
				acell=this._nextRowCell(arow, dir, Math.abs(i)-1);
			else
				acell=arow.childNodes[i];
		} else {
			var i = acell._cellIndex+dir;
			
			if (i >= 0&&i < this._cCount){
				if (arow._childIndexes)
					i=arow._childIndexes[acell._cellIndex]+dir;
				acell=arow.childNodes[i];
			} else {
				
				acell=this._nextRowCell(arow, dir, (dir == 1 ? 0 : (this._cCount-1)));
			}
		}
		
		if (!acell){
			if ((dir == 1)&&this.tabEnd){
				this.tabEnd.focus();
				this.tabEnd.focus();
				this.setActive(false);
			}
			
			if ((dir == -1)&&this.tabStart){
				this.tabStart.focus();
				this.tabStart.focus();
				this.setActive(false);
			}
			return null;
		}
		
		//tab out
		
		// tab readonly
		if (acell.style.display != "none"
			&&(!this.smartTabOrder||!this.cells(acell.parentNode.idd, acell._cellIndex).isDisabled()))
		return acell;
		return this._getNextCell(acell, dir);
		// tab readonly
		
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this._nextRow=function(ind, dir){
		var r = this.render_row(ind+dir);
		if (!r || r==-1) return null;
		if (r&&r.style.display == "none")
			return this._nextRow(ind+dir, dir);
		
		return r;
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this.scrollPage=function(dir){ 
		if (!this.rowsBuffer.length) return;
		var master = this._realfake?this._fake:this;
		var new_ind = Math.floor((master._r_select||this.getRowIndex(this.row.idd)||0)+(dir)*this.objBox.offsetHeight / (this._srdh||20));
		
		if (new_ind < 0)
			new_ind=0;
		if (new_ind >= this.rowsBuffer.length)
			new_ind=this.rowsBuffer.length-1;
		
		if (this._srnd && !this.rowsBuffer[new_ind]){			
			this.objBox.scrollTop+=Math.floor((dir)*this.objBox.offsetHeight / (this._srdh||20))*(this._srdh||20);
			if (this._fake) this._fake.objBox.scrollTop = this.objBox.scrollTop;
			master._r_select=new_ind;
		} else {
			this.selectCell(new_ind, this.cell._cellIndex, true, false,false,(this.multiLine || this._srnd));
			if (!this.multiLine && !this._srnd && !this._realfake){
				this.objBox.scrollTop=this.getRowById(this.getRowId(new_ind)).offsetTop;
				if (this._fake) this._fake.objBox.scrollTop = this.objBox.scrollTop;
			}
			master._r_select=null;
		}
	}
	
	/**
	*   @desc: manages keybord activity in grid
	*   @type: private
	*   @topic: 7
	*/
	this.doKey=function(ev){
		if (!ev)
			return true;
		
		if ((ev.target||ev.srcElement).value !== window.undefined){
			var zx = (ev.target||ev.srcElement);
			if (zx.className!="dhxcombo_input"&&zx.className!="dhx_tab_ignore"&&((!zx.parentNode)||(zx.parentNode.className.indexOf("editable") == -1)))
				return true;
		}
		
		if ((globalActiveDHTMLGridObject)&&(this != globalActiveDHTMLGridObject))
			return globalActiveDHTMLGridObject.doKey(ev);
		
		if (this.isActive == false){
			//document.body.onkeydown = "";
			return true;
		}
		
		if (this._htkebl)
			return true;
		
		if (!this.callEvent("onKeyPress", [
				ev.keyCode,
			ev.ctrlKey,
			ev.shiftKey,
			ev
		]))
		return false;
		
		var code = "k"+ev.keyCode+"_"+(ev.ctrlKey ? 1 : 0)+"_"+(ev.shiftKey ? 1 : 0);
		
		if (this.cell){ //if selection exists in grid only
			if (this._key_events[code]){
				if (false === this._key_events[code].call(this))
					return true;
				
				if (ev.preventDefault)
					ev.preventDefault();
				ev.cancelBubble=true;
				return false;
			}
			
			if (this._key_events["k_other"])
				this._key_events.k_other.call(this, ev);
		}
		
		return true;
	}
	
	/**
	*   @desc: selects row (and first cell of it)
	*   @param: r - row index or row object
	*   @param: fl - if true, then call function on select
	*   @param: preserve - preserve previously selected rows true/false (false by default)
	*   @param: show - true/false - scroll row to view, true by defaul    
	*   @type: public
	*   @topic: 1,2
	*/
	this.selectRow=function(r, fl, preserve, show){
		if (typeof (r) != 'object')
			r=this.render_row(r);
		this.selectCell(r, 0, fl, preserve, false, show)
	};
	
	/**
	*   @desc: called when row was double clicked
	*   @type: private
	*   @topic: 1,2
	*/
	this.wasDblClicked=function(ev){
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");
		
		if (el){
			var rowId = el.parentNode.idd;
			return this.callEvent("onRowDblClicked", [
					rowId,
					el._cellIndex,
					ev
			]);
		}
	}
	
	/**
	*   @desc: called when header was clicked
	*   @type: private
	*   @topic: 1,2
	*/
	this._onHeaderClick=function(e, el){
		var that = this.grid;
		el=el||that.getFirstParentOfType(_isIE ? event.srcElement : e.target, "TD");
		
		if (this.grid.resized == null){
			if (!(this.grid.callEvent("onHeaderClick", [
					el._cellIndexS,
				(e||window.event)
			])))
			return false;
			//#sorting:06042008{				
			that.sortField(el._cellIndexS, false, el)
			//#}
		}
		this.grid.resized = null;
	}
	
	/**
	*   @desc: deletes selected row(s)
	*   @type: public
	*   @topic: 2
	*/
	this.deleteSelectedRows=function(){
		var num = this.selectedRows.length //this.obj.rows.length
		
		if (num == 0)
			return;
		
		var tmpAr = this.selectedRows;
		this.selectedRows=dhtmlxArray()
		for (var i = num-1; i >= 0; i--){
			var node = tmpAr[i]
			
			if (!this.deleteRow(node.idd, node)){
				this.selectedRows[this.selectedRows.length]=node;
			}
			else {
				if (node == this.row){
					var ind = i;
				}
			}
			/*
			this.rowsAr[node.idd] = null;
			var posInCol = this.rowsCol._dhx_find(node)
			this.rowsCol[posInCol].parentNode.removeChild(this.rowsCol[posInCol]);//nb:this.rowsCol[posInCol].removeNode(true);
			this.rowsCol._dhx_removeAt(posInCol)*/
		}
		
		if (ind){
			try{
				if (ind+1 > this.rowsCol.length) //this.obj.rows.length)
					ind--;
				this.selectCell(ind, 0, true)
			}
			catch (er){
				this.row=null
				this.cell=null
			}
		}
	}
	
	/**
	*   @desc: gets selected row id
	*   @returns: id of selected row (list of ids with default delimiter) or null if non row selected
	*   @type: public
	*   @topic: 1,2,9
	*/
	this.getSelectedRowId=function(){
		var selAr = new Array(0);
		var uni = {
		};
		
		for (var i = 0; i < this.selectedRows.length; i++){
			var id = this.selectedRows[i].idd;
			
			if (uni[id])
				continue;
			
			selAr[selAr.length]=id;
			uni[id]=true;
		}
		
		//..
		if (selAr.length == 0)
			return null;
		else
			return selAr.join(this.delim);
	}
	
	/**
	*   @desc: gets index of selected cell
	*   @returns: index of selected cell or -1 if there is no selected sell
	*   @type: public
	*   @topic: 1,4
	*/
	this.getSelectedCellIndex=function(){
		if (this.cell != null)
			return this.cell._cellIndex;
		else
			return -1;
	}
	/**
	*   @desc: gets width of specified column in pixels
	*   @param: ind - column index
	*   @returns: column width in pixels
	*   @type: public
	*   @topic: 3,7
	*/
	this.getColWidth=function(ind){
		return parseInt(this.cellWidthPX[ind]);
	}
	
	/**
	*   @desc: sets width of specified column in pixels (soen't works with procent based grid)
	*   @param: ind - column index
	*   @param: value - new width value
	*   @type: public
	*   @topic: 3,7
	*/
	this.setColWidth=function(ind, value){
		if (value == "*")
			this.initCellWidth[ind] = "*";
		else {
			if (this._hrrar[ind]) return; //hidden
			if (this.cellWidthType == 'px')
				this.cellWidthPX[ind]=parseInt(value);
			else
				this.cellWidthPC[ind]=parseInt(value);
		}
		this.setSizes();
	}
	/**
	*   @desc: gets row index by id (grid only)
	*   @param: row_id - row id
	*   @returns: row index or -1 if there is no row with specified id
	*   @type: public
	*   @topic: 2
	*/
	this.getRowIndex=function(row_id){
		for (var i = 0; i < this.rowsBuffer.length; i++){
			if(this.rowsBuffer[i]&&this.rowsBuffer[i].idd == row_id){
				return i;
			}
		}
		return -1;
	}
	/**
	*   @desc: gets row id by index
	*   @param: ind - row index
	*   @returns: row id or null if there is no row with specified index
	*   @type: public
	*   @topic: 2
	*/
	this.getRowId=function(ind){
		return this.rowsBuffer[ind] ? this.rowsBuffer[ind].idd : this.undefined;
	}
	/**
	*   @desc: sets new id for row by its index
	*   @param: ind - row index
	*   @param: row_id - new row id
	*   @type: public
	*   @topic: 2
	*/
	this.setRowId=function(ind, row_id){
		this.changeRowId(this.getRowId(ind), row_id)
	}
	/**
	*   @desc: changes id of the row to the new one
	*   @param: oldRowId - row id to change
	*   @param: newRowId - row id to set
	*   @type:public
	*   @topic: 2
	*/
	this.changeRowId=function(oldRowId, newRowId){
		if (oldRowId == newRowId)
			return;
		
		for (var i=0; i<row.childNodes.length; i++)
		if (row.childNodes[i]._code)
		this._compileSCL("-",row.childNodes[i]);
		
		var row = this.rowsAr[oldRowId]
		row.idd=newRowId;
		
		if (this.UserData[oldRowId]){
			this.UserData[newRowId]=this.UserData[oldRowId]
			this.UserData[oldRowId]=null;
		}
		
		if (this._h2&&this._h2.get[oldRowId]){
			this._h2.get[newRowId]=this._h2.get[oldRowId];
			this._h2.get[newRowId].id=newRowId;
			delete this._h2.get[oldRowId];
		}
		
		this.rowsAr[oldRowId]=null;
		this.rowsAr[newRowId]=row;
		
		if(typeof(row.childNodes) !== "undefined"){
			for (var i = 0; i < row.childNodes.length; i++){
				if (row.childNodes[i]._code){
					row.childNodes[i]._code=this._compileSCL(row.childNodes[i]._val, row.childNodes[i]);
				}
			}
		}
		
		if(this._mat_links && this._mat_links[oldRowId]){
			var a=this._mat_links[oldRowId];
			delete this._mat_links[oldRowId];
			for (var c in a)
				for (var i=0; i < a[c].length; i++)
				this._compileSCL(a[c][i].original,a[c][i]);
		}
		
		this.callEvent("onRowIdChange",[oldRowId,newRowId]);
	}
	/**
	*   @desc: sets ids to every column. Can be used then to retreive the index of the desired colum
	*   @param: [ids] - delimitered list of ids (default delimiter is ","), or empty if to use values set earlier
	*   @type: public
	*   @topic: 3
	*/
	this.setColumnIds=function(ids){
		this.columnIds=ids.split(this.delim)
	}
	/**
	*   @desc: sets ids to specified column.
	*   @param: ind- index of column
	*   @param: id- id of column
	*   @type: public
	*   @topic: 3
	*/
	this.setColumnId=function(ind, id){
		this.columnIds[ind]=id;
	}
	/**
	*   @desc: gets column index by column id
	*   @param: id - column id
	*   @returns: index of the column
	*   @type: public
	*   @topic: 3
	*/
	this.getColIndexById=function(id){
		for (var i = 0; i < this.columnIds.length; i++)
			if (this.columnIds[i] == id)
			return i;
	}
	/**
	*   @desc: gets column id of column specified by index
	*   @param: cin - column index
	*   @returns: column id
	*   @type: public
	*   @topic: 3
	*/
	this.getColumnId=function(cin){
		return this.columnIds[cin];
	}
	
	/**
	*   @desc: gets label of column specified by index
	*   @param: cin - column index
	*   @returns: column label
	*   @type: public
	*   @topic: 3
	*/
	this.getColumnLabel=function(cin, ind, hdr, raw){
		var z = (hdr||this.hdr).rows[(ind||0)+1];
		for (var i=0; i<z.cells.length; i++)
			if (z.cells[i]._cellIndexS==cin) return raw ? z.cells[i].firstChild.innerHTML : (_isIE ? z.cells[i].innerText : z.cells[i].textContent);
		return "";
	};
	this.getColLabel = this.getColumnLabel;
	/**
	*   @desc: gets label of footer specified by index
	*   @param: cin - column index
	*   @returns: column label
	*   @type: public
	*   @topic: 3
	*/
	this.getFooterLabel=function(cin, ind, raw){
		return this.getColumnLabel(cin,ind,this.ftr, raw);
	}
	
	
	/**
	*   @desc: sets row text BOLD
	*   @param: row_id - row id
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowTextBold=function(row_id){
		var r=this.getRowById(row_id)
		if (r) r.style.fontWeight="bold";
	}
	/**
	*   @desc: sets style to row
	*   @param: row_id - row id
	*   @param: styleString - style string in common format (exmpl: "color:red;border:1px solid gray;")
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowTextStyle=function(row_id, styleString){
		var r = this.getRowById(row_id)
		if (!r) return;
		for (var i = 0; i < r.childNodes.length; i++){
			var pfix = r.childNodes[i]._attrs["style"]||"";
			//#__pro_feature:21092006{
			//#column_hidden:21092006{
			if ((this._hrrar)&&(this._hrrar[i]))
				pfix="display:none;";
			//#}
			//#}
			if (_isIE)
				r.childNodes[i].style.cssText=pfix+"width:"+r.childNodes[i].style.width+";"+styleString;
			else
				r.childNodes[i].style.cssText=pfix+"width:"+r.childNodes[i].style.width+";"+styleString;
		}
	}
	/**
	*   @desc: sets background color of row (via bgcolor attribute)
	*   @param: row_id - row id
	*   @param: color - color value
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowColor=function(row_id, color){
		var r = this.getRowById(row_id)
		
		for (var i = 0; i < r.childNodes.length; i++)r.childNodes[i].bgColor=color;
	}
	/**
	*   @desc: sets style to cell
	*   @param: row_id - row id
	*   @param: ind - cell index
	*   @param: styleString - style string in common format (exmpl: "color:red;border:1px solid gray;")
	*   @type: public
	*   @topic: 2,6
	*/
	this.setCellTextStyle=function(row_id, ind, styleString){
		var r = this.getRowById(row_id)
		
		if (!r)
			return;
		
		var cell = r.childNodes[r._childIndexes ? r._childIndexes[ind] : ind];
		
		if (!cell)
			return;
		var pfix = "";
		//#__pro_feature:21092006{
		//#column_hidden:21092006{
		if ((this._hrrar)&&(this._hrrar[ind]))
			pfix="display:none;";
		//#}
		//#}
		if (_isIE)
			cell.style.cssText=pfix+"width:"+cell.style.width+";"+styleString;
		else
			cell.style.cssText=pfix+"width:"+cell.style.width+";"+styleString;
	}
	
	/**
	*   @desc: sets row text weight to normal
	*   @param: row_id - row id
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowTextNormal=function(row_id){
		var r=this.getRowById(row_id);
		if (r) r.style.fontWeight="normal";
	}
	/**
	*   @desc: determines if row with specified id exists
	*   @param: row_id - row id
	*   @returns: true if exists, false otherwise
	*   @type: public
	*   @topic: 2,7
	*/
	this.doesRowExist=function(row_id){
		if (this.getRowById(row_id) != null)
			return true
		else
			return false
	}
	
	
	
	/**
	*   @desc: gets number of columns in grid
	*   @returns: number of columns in grid
	*   @type: public
	*   @topic: 3,7
	*/
	this.getColumnsNum=function(){
		return this._cCount;
	}
	
	
	//#moving_rows:06042008{
	/**
	*   @desc: moves row one position up if possible
	*   @param: row_id -  row id
	*   @type: public
	*   @topic: 2
	*/
	this.moveRowUp=function(row_id){
		var r = this.getRowById(row_id)
		
		if (this.isTreeGrid())
			return this.moveRowUDTG(row_id, -1);
		
		var rInd = this.rowsCol._dhx_find(r)
		if ((r.previousSibling)&&(rInd != 0)){
			r.parentNode.insertBefore(r, r.previousSibling)
			this.rowsCol._dhx_swapItems(rInd, rInd-1)
			this.setSizes();
			var bInd=this.rowsBuffer._dhx_find(r);
			this.rowsBuffer._dhx_swapItems(bInd,bInd-1);
			
			if (this._cssEven)
				this._fixAlterCss(rInd-1);
		}
	}
	/**
	*   @desc: moves row one position down if possible
	*   @param: row_id -  row id
	*   @type: public
	*   @topic: 2
	*/
	this.moveRowDown=function(row_id){
		var r = this.getRowById(row_id)
		
		if (this.isTreeGrid())
			return this.moveRowUDTG(row_id, 1);
		
		var rInd = this.rowsCol._dhx_find(r);
		if (r.nextSibling){ 
			this.rowsCol._dhx_swapItems(rInd, rInd+1)
			
			if (r.nextSibling.nextSibling)
				r.parentNode.insertBefore(r, r.nextSibling.nextSibling)
			else
				r.parentNode.appendChild(r)
			this.setSizes();
			
			var bInd=this.rowsBuffer._dhx_find(r);
			this.rowsBuffer._dhx_swapItems(bInd,bInd+1);
			
			if (this._cssEven)
				this._fixAlterCss(rInd);
		}
	}
	//#}
	//#co_excell:06042008{
	/**
	* @desc: gets Combo object of specified column. Use it to change select box value for cell before editor opened
	*   @type: public
	*   @topic: 3,4
	*   @param: col_ind - index of the column to get combo object for
	*/
	this.getCombo=function(col_ind){
		if (!this.combos[col_ind]){
			this.combos[col_ind]=new dhtmlXGridComboObject();
		}
		return this.combos[col_ind];
	}
	//#}
	/**
	*   @desc: sets user data to row
	*   @param: row_id -  row id. if empty then user data is set for grid (not row)
	*   @param: name -  name of user data block
	*   @param: value -  value of user data block
	*   @type: public
	*   @topic: 2,5
	*/
	this.setUserData=function(row_id, name, value){
		if (!row_id)
			row_id="gridglobaluserdata";
		
		if (!this.UserData[row_id])
			this.UserData[row_id]=new Hashtable()
		this.UserData[row_id].put(name, value)
	}
	/**
	*   @desc: gets user Data
	*   @param: row_id -  row id. if empty then user data is for grid (not row)
	*   @param: name -  name of user data
	*   @returns: value of user data
	*   @type: public
	*   @topic: 2,5
	*/
	this.getUserData=function(row_id, name){
		if (!row_id)
			row_id="gridglobaluserdata";		
		this.getRowById(row_id); //parse row if necessary
		
		var z = this.UserData[row_id];
		return (z ? z.get(name) : "");
	}
	
	/**
	*   @desc: manage editibility of the grid
	*   @param: [fl] - set not editable if FALSE, set editable otherwise
	*   @type: public
	*   @topic: 7
	*/
	this.setEditable=function(fl){
		this.isEditable=dhx4.s2b(fl);
	}
	/**
	*   @desc: selects row by ID
	*   @param: row_id - row id
	*   @param: multiFL - VOID. select multiple rows
	*   @param: show - true/false - scroll row to view, true by defaul    
	*   @param: call - true to call function on select
	*   @type: public
	*   @topic: 1,2
	*/
	this.selectRowById=function(row_id, multiFL, show, call){
		if (!call)
			call=false;
		this.selectCell(this.getRowById(row_id), 0, call, multiFL, false, show);
	}
	
	/**
	*   @desc: removes selection from the grid
	*   @type: public
	*   @topic: 1,9
	*/
	this.clearSelection=function(){
		this.editStop()
		
		for (var i = 0; i < this.selectedRows.length; i++){
			var r = this.rowsAr[this.selectedRows[i].idd];
			
			if (r)
				r.className=r.className.replace(/[ \t]*rowselected/g, "");
		}
		
		//..
		this.selectedRows=dhtmlxArray()
		this.row=null;
		
		if (this.cell != null){
			this.cell.className=this.cell.className.replace(/[ \t]*cellselected/g, "");
			this.cell=null;
		}
		
		this.callEvent("onSelectionCleared",[]);
	}
	/**
	*   @desc: copies row content to another existing row
	*   @param: from_row_id - id of the row to copy content from
	*   @param: to_row_id - id of the row to copy content to
	*   @type: public
	*   @topic: 2,5
	*/
	this.copyRowContent=function(from_row_id, to_row_id){
		var frRow = this.getRowById(from_row_id)
		
		if (!this.isTreeGrid())
		for (var i = 0; i < frRow.cells.length; i++){
			this.cells(to_row_id, i).setValue(this.cells(from_row_id, i).getValue())
		}
		else
			this._copyTreeGridRowContent(frRow, from_row_id, to_row_id);
		
		//for Mozilla (to avaoid visual glitches)
		if (!_isIE)
			this.getRowById(from_row_id).cells[0].height=frRow.cells[0].offsetHeight
	}
	/**
	*   @desc: sets new label for cell in footer
	*   @param: col - header column index
	*   @param: label - new label for the cpecified footer's column. Can contai img:[imageUrl]Text Label
	*	@param: ind - header row index 
	*   @type: public
	*   @topic: 3,6
	*/
	this.setFooterLabel=function(c, label, ind){
		return this.setColumnLabel(c,label,ind,this.ftr);
	};
	/**
	*   @desc: sets new column header label
	*   @param: col - header column index
	*   @param: label - new label for the cpecified header's column. Can contai img:[imageUrl]Text Label
	*	@param: ind - header row index 
	*   @type: public
	*   @topic: 3,6
	*/
	this.setColumnLabel=function(c, label, ind, hdr){
		var z = (hdr||this.hdr).rows[ind||1];
		var col = (z._childIndexes ? z._childIndexes[c] : c);
		if (!z.cells[col]) return;
		if (!this.useImagesInHeader){
			var hdrHTML = "<div class='hdrcell'>"
			
			if (label.indexOf('img:[') != -1){
				var imUrl = label.replace(/.*\[([^>]+)\].*/, "$1");
				label=label.substr(label.indexOf("]")+1, label.length)
				hdrHTML+="<img width='18px' height='18px' align='absmiddle' src='"+imUrl+"' hspace='2'>"
			}
			hdrHTML+=label;
			hdrHTML+="</div>";
			z.cells[col].innerHTML=hdrHTML;
			
			if (this._hstyles[c])
				z.cells[col].style.cssText=this._hstyles[c];
			
			/*HSITX*/
			if (this._hcustomclass[c] && this._hcustomclass[c] !== "")
				z.cells[col].classList.add(this._hcustomclass[c]);
			/**/
			
		} else { //if images in header header
			z.cells[col].style.textAlign="left";
			z.cells[col].innerHTML="<img src='"+label+"'>";
			//preload sorting headers (asc/desc)
			var a = new Image();
			a.src=""+label.replace(/(\.[a-z]+)/, ".des$1");
			this.preloadImagesAr[this.preloadImagesAr.length]=a;
			var b = new Image();
			b.src=""+label.replace(/(\.[a-z]+)/, ".asc$1");
			this.preloadImagesAr[this.preloadImagesAr.length]=b;
		}
		
		if ((label||"").indexOf("#") != -1){
			var t = label.match(/(^|{)#([^}]+)(}|$)/);
			
			if (t){
				var tn = "_in_header_"+t[2];
				
				if (this[tn])
					this[tn]((this.forceDivInHeader ? z.cells[col].firstChild : z.cells[col]), col, label.split(t[0]));
			}
		}
	};
	this.setColLabel = function(a,b,ind,c){
		return this.setColumnLabel(a,b,(ind||0)+1,c);
	};
	/**
	*   @desc: deletes all rows in grid
	*   @param: header - (boolean) enable/disable cleaning header
	*   @type: public
	*   @topic: 5,7,9
	*/
	this.clearAll=function(header){
		if (!this.obj.rows[0]) return; //call before initilization
		if (this._h2){
			this._h2=this._createHierarchy();
			
			if (this._fake){
				if (this._realfake)
					this._h2=this._fake._h2;
				else
					this._fake._h2=this._h2;
			}
		}
		
		this.limit=this._limitC=0;
		this.editStop(true);
		
		if (this._dLoadTimer)
			window.clearTimeout(this._dLoadTimer);
		
		if (this._dload){
			this.objBox.scrollTop=0;
			this.limit=this._limitC||0;
			this._initDrF=true;
		}
		
		var len = this.rowsCol.length;
		
		//for some case
		len=this.obj.rows.length;
		
		for (var i = len-1; i > 0; i--){
			var t_r = this.obj.rows[i];
			t_r.parentNode.removeChild(t_r);
		}
		
		if (header){
			this._master_row=null;
			this.obj.rows[0].parentNode.removeChild(this.obj.rows[0]);
			
			for (var i = this.hdr.rows.length-1; i >= 0; i--){
				var t_r = this.hdr.rows[i];
				t_r.parentNode.removeChild(t_r);
			}
			
			if (this.ftr){
				this.ftr.parentNode.removeChild(this.ftr);
				this.ftr=null;
			}
			this._aHead=this.ftr=this.cellWidth=this._aFoot=null;
			this.cellType=dhtmlxArray();
			this._hrrar=[];
			this.columnIds=[];
			this.combos=[];
			this._strangeParams=[];
			this.defVal = [];
			this._ivizcol = null;
		}
		
		//..
		this.row=null;
		this.cell=null;
		
		this.rowsCol=dhtmlxArray()
		this.rowsAr={}; //array of rows by idd
		this._RaSeCol=[];
		this.rowsBuffer=dhtmlxArray()
		this.UserData=[]
		this.selectedRows=dhtmlxArray();
		
		if (this.pagingOn || this._srnd)
			this.xmlFileUrl="";
		if (this.pagingOn)
			this.changePage(1);
		
		//  if (!this._fake){
		/*
		if ((this._hideShowColumn)&&(this.hdr.rows[0]))
		for (var i=0; i<this.hdr.rows[0].cells.length; i++)
		this._hideShowColumn(i,"");
		this._hrrar=new Array();*/
		//}
		if (this._contextCallTimer)
			window.clearTimeout(this._contextCallTimer);
		
		if (this._sst)
			this.enableStableSorting(true);
		this._fillers=this.undefined;
		this.setSortImgState(false);
		this.setSizes();
		//this.obj.scrollTop = 0;
		
		this.callEvent("onClearAll", []);
	}
	
	//#sorting:06042008{
	/**
	*   @desc: sorts grid by specified field
	*    @invoke: header click
	*   @param: [ind] - index of the field
	*   @param: [repeatFl] - if to repeat last sorting
	*   @type: private
	*   @topic: 3
	*/
	this.sortField=function(ind, repeatFl, r_el){
		if (this.getRowsNum() == 0)
			return false;
		
		var el = this.hdr.rows[0].cells[ind];
		
		if (!el)
			return; //somehow
		// if (this._dload  && !this.callEvent("onBeforeSorting",[ind,this]) ) return true;
		
		if (el.tagName == "TH"&&(this.fldSort.length-1) >= el._cellIndex
			&&this.fldSort[el._cellIndex] != 'na'){ //this.entBox.fieldstosort!="" &&
		var data=this.getSortingState();
		var sortType= ( data[0]==ind && data[1]=="asc" ) ? "des" : "asc";
		
		if (!this.callEvent("onBeforeSorting", [
				ind,
			this.fldSort[ind],
			sortType
		]))
		return;
		this.sortImg.className="dhxgrid_sort_"+(sortType == "asc" ? "asc" : "desc");
		
		//for header images
		if (this.useImagesInHeader){
			var cel = this.hdr.rows[1].cells[el._cellIndex].firstChild;
			
			if (this.fldSorted != null){
				var celT = this.hdr.rows[1].cells[this.fldSorted._cellIndex].firstChild;
				celT.src=celT.src.replace(/(\.asc\.)|(\.des\.)/, ".");
			}
			cel.src=cel.src.replace(/(\.[a-z]+)$/, "."+sortType+"$1")
		}
		//.
		this.sortRows(el._cellIndex, this.fldSort[el._cellIndex], sortType)
		this.fldSorted=el;
		if (r_el && r_el.tagName.toLowerCase() != "th")
			this.r_fldSorted=r_el;

		var c = this.hdr.rows[1];
		var c = r_el.parentNode;
		var real_el = c._childIndexes ? c._childIndexes[el._cellIndex] : el._cellIndex;
		this.setSortImgPos(false, false, false, r_el);
			}
	}
	//#__pro_feature:21092006{
	//#custom_sort:21092006{
	/**
	*   @desc: set custom sorting (custom sort has three params - valueA,valueB,order; where order can be asc or des)
	*   @param: func - function to use for comparison
	*   @param:   col - index of column to apply custom sorting to
	*   @type: public
	*   @edition: Professional
	*   @topic: 3
	*/
	this.setCustomSorting=function(func, col){
		if (!this._customSorts)
			this._customSorts=new Array();
		this._customSorts[col]=( typeof (func) == "string") ? eval(func) : func;
		this.fldSort[col]="cus";
	}
	//#}
	//#}
	//#}
	/**
	*   @desc: specify if values passed to Header are images file names
	*   @param: fl - true to treat column header values as image names
	*   @type: public
	*   @before_init: 1
	*   @topic: 0,3
	*/
	this.enableHeaderImages=function(fl){
		this.useImagesInHeader=fl;
	}
	
	/**
	*   @desc: set header label and default params for new headers
	*   @param: hdrStr - header string with delimiters
	*   @param: splitSign - string used as a split marker, optional. Default is "#cspan"
	*   @param: styles - array of header styles
	*   @type: public
	*   @before_init: 1
	*   @topic: 0,3
	*/
	this.setHeader=function(hdrStr, splitSign, styles, customClass){
		if (typeof (hdrStr) != "object")
			var arLab = this._eSplit(hdrStr);
		else
			arLab=[].concat(hdrStr);
		
		var arWdth = new Array(0);
		var arTyp = new dhtmlxArray(0);
		var arAlg = new Array(0);
		var arVAlg = new Array(0);
		var arSrt = new Array(0);
		
		for (var i = 0; i < arLab.length; i++){
			arWdth[arWdth.length]=Math.round(100 / arLab.length);
			arTyp[arTyp.length]="ed";
			arAlg[arAlg.length]="left";
			arVAlg[arVAlg.length]="middle"; //top
			arSrt[arSrt.length]="na";
		}
		
		this.splitSign=splitSign||"#cspan";
		this.hdrLabels=arLab;
		this.cellWidth=arWdth;
		if (!this.initCellWidth.length) this.setInitWidthsP(arWdth.join(this.delim),true);
		this.cellType=arTyp;
		this.cellAlign=arAlg;
		this.cellVAlign=arVAlg;
		this.fldSort=arSrt;
		this._hstyles=styles||[];
		/*HSITX*/
		this._hcustomclass=customClass||[];
		/**/
	}
	/**
	*   @desc: 
	*   @param: str - ...
	*   @type: private
	*/
	this._eSplit=function(str){
		if (![].push)
			return str.split(this.delim);
		
		var a = "r"+(new Date()).valueOf();
		var z = this.delim.replace(/([\|\+\*\^])/g, "\\$1")
		return (str||"").replace(RegExp(z, "g"), a).replace(RegExp("\\\\"+a, "g"), this.delim).split(a);
	}
	
	/**
	*   @desc: get column type by column index
	*   @param: cInd - column index
	*   @returns:  type code
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.getColType=function(cInd){
		return this.cellType[cInd];
	}
	
	/**
	*   @desc: get column type by column ID
	*   @param: cID - column id
	*   @returns:  type code
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.getColTypeById=function(cID){
		return this.cellType[this.getColIndexById(cID)];
	}
	
	/**
	*   @desc: set column types
	*   @param: typeStr - type codes list (default delimiter is ",")
	*   @before_init: 2
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.setColTypes=function(typeStr){
		this.cellType=dhtmlxArray(typeStr.split(this.delim));
		this._strangeParams=new Array();
		
		for (var i = 0; i < this.cellType.length; i++){
			if ((this.cellType[i].indexOf("[") != -1)){
				var z = this.cellType[i].split(/[\[\]]+/g);
				this.cellType[i]=z[0];
				this.defVal[i]=z[1];
				
				if (z[1].indexOf("=") == 0){
					this.cellType[i]="math";
					this._strangeParams[i]=z[0];
				}
			}
			if (!window["eXcell_"+this.cellType[i]]) dhx4.callEvent("onConfigurationError",["Incorrect cell type: "+this.cellType[i],this,this.cellType[i]]);
		}
	}
	/**
	*   @desc: set column sort types (avaialble: str, int, date, na or function object for custom sorting)
	*   @param: sortStr - sort codes list with default delimiter
	*   @before_init: 1
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.setColSorting=function(sortStr){
		this.fldSort=sortStr.split(this.delim)
		//#__pro_feature:21092006{
		//#custom_sort:21092006{
		//str, int, date
		var check = {str:1, "int":1, date:1};
		for (var i = 0; i < this.fldSort.length; i++)
		if ((!check[this.fldSort[i]])&&( typeof (window[this.fldSort[i]]) == "function")){
			if (!this._customSorts)
				this._customSorts=new Array();
			this._customSorts[i]=window[this.fldSort[i]];
			this.fldSort[i]="cus";
		}
		//#}
		//#}
	}
	/**
	*   @desc: set align of values in columns
	*   @param: alStr - list of align values (possible values are: right,left,center,justify). Default delimiter is ","
	*   @before_init: 1
	*   @type: public
	*   @topic: 0,3
	*/
	this.setColAlign=function(alStr){
		this.cellAlign=alStr.split(this.delim)
		for (var i=0; i < this.cellAlign.length; i++)
			this.cellAlign[i]=this.cellAlign[i]._dhx_trim();
	}
	/**
	*   @desc: set vertical align of columns
	*   @param: valStr - vertical align values list for columns (possible values are: baseline,sub,super,top,text-top,middle,bottom,text-bottom)
	*   @before_init: 1
	*   @type: public
	*   @topic: 0,3
	*/
	this.setColVAlign=function(valStr){
		this.cellVAlign=valStr.split(this.delim)
	}
	
	/**
	* 	@desc: create grid with no header. Call before initialization, but after setHeader. setHeader have to be called in any way as it defines number of columns
	*   @param: fl - true to use no header in the grid
	*   @type: public
	*   @before_init: 1
	*   @topic: 0,7
	*/
	this.setNoHeader=function(fl){
		this.noHeader=dhx4.s2b(fl);
	}
	/**
	*   @desc: scrolls row to the visible area
	*   @param: rowID - row id
	*   @type: public
	*   @topic: 2,7
	*/
	this.showRow=function(rowID){
		this.getRowById(rowID)
		
		if (this._h2) this.openItem(this._h2.get[rowID].parent.id);
		var c = this.getRowById(rowID).childNodes[0];
		
		while (c&&c.style.display == "none")
			c=c.nextSibling;
		
		if (c)
			this.moveToVisible(c, true)
	}
	
	/**
	*   @desc: modify default style of grid and its elements. Call before or after Init
	*   @param: ss_header - style def. expression for header
	*   @param: ss_grid - style def. expression for grid cells
	*   @param: ss_selCell - style def. expression for selected cell
	*   @param: ss_selRow - style def. expression for selected Row
	*   @type: public
	*   @before_init: 2
	*   @topic: 0,6
	*/
	this.setStyle=function(ss_header, ss_grid, ss_selCell, ss_selRow){
		this.ssModifier=[
			ss_header,
			ss_grid,
			ss_selCell,
			ss_selCell,
			ss_selRow
		];
		
		var prefs = ["#"+this.entBox.id+" table.hdr td", "#"+this.entBox.id+" table.obj td",
			"#"+this.entBox.id+" table.obj tr.rowselected td.cellselected",
		"#"+this.entBox.id+" table.obj td.cellselected", "#"+this.entBox.id+" table.obj tr.rowselected td"];
		
		var index = 0;
		while (!_isIE){
			try{
				var temp = document.styleSheets[index].cssRules.length;
			} catch(e) { index++; continue; }
			break;
		}
		
		for (var i = 0; i < prefs.length; i++)
		if (this.ssModifier[i]){
			if (_isIE)
				document.styleSheets[0].addRule(prefs[i], this.ssModifier[i]);
			else
				document.styleSheets[index].insertRule(prefs[i]+(" { "+this.ssModifier[i]+" }"), document.styleSheets[index].cssRules.length);
		}
	}
	/**
	*   @desc: colorize columns  background.
	*   @param: clr - colors list
	*   @type: public
	*   @before_init: 1
	*   @topic: 3,6
	*/
	this.setColumnColor=function(clr){
		this.columnColor=clr.split(this.delim)
	}
	//#alter_css:06042008{
	/**
	*   @desc: set even/odd css styles
	*   @param: cssE - name of css class for even rows
	*   @param: cssU - name of css class for odd rows
	*   @param: perLevel - true/false - mark rows not by order, but by level in treegrid
	*   @param: levelUnique - true/false - creates additional unique css class based on row level
	*   @type: public
	*   @before_init: 1
	*   @topic: 3,6
	*/
	this.enableAlterCss=function(cssE, cssU, perLevel, levelUnique){
		if (cssE||cssU)
		this.attachEvent("onGridReconstructed",function(){
				this._fixAlterCss();
				if (this._fake)
					this._fake._fixAlterCss();
		});
		
		this._cssSP=perLevel;
		this._cssSU=levelUnique;
		this._cssEven=cssE;
		this._cssUnEven=cssU;
	}
	//#}
	/**
	*   @desc: recolor grid from defined point
	*   @type: private
	*   @before_init: 1
	*   @topic: 3,6
	*/
	this._fixAlterCss=function(ind){
		//#alter_css:06042008{		
		if (this._h2 && (this._cssSP || this._cssSU))
			return this._fixAlterCssTGR(ind);
		if (!this._cssEven && !this._cssUnEven) return;
		ind=ind||0;
		var j = ind;
		
		for (var i = ind; i < this.rowsCol.length; i++){
			if (!this.rowsCol[i])
				continue;
			
			if (this.rowsCol[i].style.display != "none"){
				if (this.rowsCol[i]._cntr) { j=1; continue; }
				if (this.rowsCol[i].className.indexOf("rowselected") != -1){
					if (j%2 == 1)
						this.rowsCol[i].className=this._cssUnEven+" rowselected "+(this.rowsCol[i]._css||"");
					else
						this.rowsCol[i].className=this._cssEven+" rowselected "+(this.rowsCol[i]._css||"");
				} else {
					if (j%2 == 1)
						this.rowsCol[i].className=this._cssUnEven+" "+(this.rowsCol[i]._css||"");
					else
						this.rowsCol[i].className=this._cssEven+" "+(this.rowsCol[i]._css||"");
				}
				j++;
			}
		}
		//#}		
	}
	//#__pro_feature:21092006{
	/**
	*     @desc: clear wasChanged state for all cells in grid
	*     @type: public
	*     @edition: Professional
	*     @topic: 7
	*/
	this.clearChangedState=function(clear_added){
		for (var i = 0; i < this.rowsCol.length; i++){
			var row = this.rowsCol[i];
			if (row && row.childNodes){
				var cols = row.childNodes.length;
				for (var j = 0; j < cols; j++)row.childNodes[j].wasChanged=false;
				if (clear_added)
					row._added = false;
			}
		}
	};
	
	/**
	*     @desc: get list of IDs of changed rows
	*     @type: public
	*     @edition: Professional
	*     @return: list of ID of changed rows
	*     @topic: 7
	*/
	this.getChangedRows=function(and_added){
		var res = new Array();
		this.forEachRow(function(id){
				var row = this.rowsAr[id];
				if (row.tagName!="TR") return; 
				var cols = row.childNodes.length;
				if (and_added && row._added)
					res[res.length]=row.idd;
				else
					for (var j = 0; j < cols; j++)
					if (row.childNodes[j].wasChanged){
						res[res.length]=row.idd;
						break;
					}
		})
		return res.join(this.delim);
	};
	
	
	//#serialization:21092006{
	
	this._sUDa=false;
	this._sAll=false;
	
	/**
	*     @desc: configure XML serialization
	*     @type: public
	*     @edition: Professional
	*     @param: userData - enable/disable user data serialization
	*     @param: fullXML - enable/disable full XML serialization (selection state)
	*     @param: config - serialize grid configuration
	*     @param: changedAttr - include changed attribute
	*     @param: onlyChanged - include only Changed  rows in result XML
	*     @param: asCDATA - output cell values as CDATA sections (prevent invalid XML)
	*     @topic: 0,5,7
	*/
	this.setSerializationLevel=function(userData, fullXML, config, changedAttr, onlyChanged, asCDATA){
		this._sUDa=userData;
		this._sAll=fullXML;
		this._sConfig=config;
		this._chAttr=changedAttr;
		this._onlChAttr=onlyChanged;
		this._asCDATA=asCDATA;
	}
	
	
	/**
	*     @desc: configure which column must be serialized (if you do not use this method, then all columns will be serialized)
	*     @type: public
	*     @edition: Professional
	*     @param: list - list of true/false values separated by comma, if list empty then all fields will be serialized
	*     @topic: 0,5,7
	*/
	this.setSerializableColumns=function(list){
		if (!list){
			this._srClmn=null;
			return;
		}
		this._srClmn=(list||"").split(",");
		
		for (var i = 0; i < this._srClmn.length; i++)this._srClmn[i]=dhx4.s2b(this._srClmn[i]);
	}
	
	/**
	*     @desc: serialize a collection of rows
	*     @type: private
	*     @topic: 0,5,7
	*/
	this._serialise=function(rCol, inner, closed){
		this.editStop()
		var out = [];
		//rows collection
		var close = "</"+this.xml.s_row+">"
		
		if (this.isTreeGrid()){
			this._h2.forEachChildF(0, function(el){
					var temp = this._serializeRow(this.render_row_tree(-1, el.id));
					out.push(temp);
					
					if (temp)
						return true;
					else
						return false;
			}, this, function(){
				out.push(close);
			});
		}
		else
			for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i]){
				if (this._chAttr && this.rowsBuffer[i]._locator)
					continue;
				
				var temp = this._serializeRow(this.render_row(i));
				out.push(temp);
				
				if (temp)
					out.push(close);
			}
			
			return [out.join("")];
	}
	
	/**
	*   @desc: serialize TR or xml node to grid formated xml (row tag)
	*   @param: r - TR or xml node (row)
	*   @retruns: string - xml representation of passed row
	*   @type: private
	*/
	this._serializeRow=function(r, i){
		var out = [];
		var ra = this.xml.row_attrs;
		var ca = this.xml.cell_attrs;
		
		out.push("<"+this.xml.s_row);
		out.push(" id='"+r.idd+"'");
		
		if ((this._sAll)&&this.selectedRows._dhx_find(r) != -1)
			out.push(" selected='1'");
		
		if (this._h2&&this._h2.get[r.idd].state == "minus")
			out.push(" open='1'");
		
		if (ra.length)
			for (var i = 0; i < ra.length; i++)out.push(" "+ra[i]+"='"+r._attrs[ra[i]]+"'");
		out.push(">");
		
		//userdata
		if (this._sUDa&&this.UserData[r.idd]){
			keysAr=this.UserData[r.idd].getKeys()
			
			for (var ii = 0; ii < keysAr.length; ii++){
				var subkey = keysAr[ii];
				if (subkey.indexOf("__") !== 0)
					out.push("<userdata name='"+subkey+"'>"+(this._asCDATA?"<![CDATA[":"")+this.UserData[r.idd].get(subkey)+(this._asCDATA?"]]>":"")+"</userdata>");
			}
		}
		
		
		//cells
		var changeFl = false;
		
		for (var jj = 0; jj < this._cCount; jj++){
			if ((!this._srClmn)||(this._srClmn[jj])){
				var zx = this.cells3(r, jj);
				out.push("<cell");
				
				if (ca.length)
					for (var i = 0; i < ca.length; i++)out.push(" "+ca[i]+"='"+zx.cell._attrs[ca[i]]+"'");
				zxVal=zx[this._agetm]();
				
				if (this._asCDATA)
					zxVal="<![CDATA["+zxVal+"]]>";
				
				//#colspan:20092006{
				if ((this._ecspn)&&(zx.cell.colSpan)&&zx.cell.colSpan > 1)
					out.push(" colspan=\""+zx.cell.colSpan+"\" ");
				//#}
				
				if (this._chAttr){
					if (zx.wasChanged()){
						out.push(" changed=\"1\"");
						changeFl=true;
					}
				}
				
				else if ((this._onlChAttr)&&(zx.wasChanged()))
					changeFl=true;
				
				if (this._sAll && this.cellType[jj]=="tree")
					out.push((this._h2 ? (" image='"+this._h2.get[r.idd].image+"'") : "")+">"+zxVal+"</cell>");
				else
					out.push(">"+zxVal+"</cell>");
				
				//#colspan:20092006{
				if ((this._ecspn)&&(zx.cell.colSpan))
				for (var u = 0; u < zx.cell.colSpan-1; u++){
					out.push("<cell/>");
					jj++;
				}
				//#}
			}
		}
		
		if ((this._onlChAttr)&&(!changeFl)&&(!r._added))
			return "";
		
		return out.join("");
	}
	
	/**
	*     @desc: serialize grid configuration
	*     @type: private
	*     @topic: 0,5,7
	*/
	this._serialiseConfig=function(){
		var out = "<head>";
		
		for (var i = 0; i < this.hdr.rows[0].cells.length; i++){
			if (this._srClmn && !this._srClmn[i]) continue;
			var sort = this.fldSort[i];
			if (sort == "cus"){
				sort = this._customSorts[i].toString();
				sort=sort.replace(/function[\ ]*/,"").replace(/\([^\f]*/,"");
			}
			out+="<column width='"+this.getColWidth(i)+"' align='"+this.cellAlign[i]+"' type='"+this.cellType[i]
			+"' sort='"+(sort||"na")+"' color='"+(this.columnColor[i]||"")+"'"
			+(this.columnIds[i]
				? (" id='"+this.columnIds[i]+"'")
				: "")+">";
			if (this._asCDATA)
				out+="<![CDATA["+this.getColumnLabel(i)+"]]>";
			else
				out+=this.getColumnLabel(i);
			var z = this.getCombo(i);
			
			if (z)
				for (var j = 0; j < z.keys.length; j++)out+="<option value='"+z.keys[j]+"'>"+z.values[j]+"</option>";
			out+="</column>"
		}
		return out+="</head>";
	}
	/**
	*     @desc: get actual xml of grid. The depth of serialization can be set with setSerializationLevel method
	*     @type: public
	*     @edition: Professional
	*     @topic: 5,7
	*/
	this.serialize=function(){
		var out = '<?xml version="1.0"?><rows>';
		
		if (this._mathSerialization)
			this._agetm="getMathValue";
		else
			this._agetm="getValue";
		
		if (this._sUDa&&this.UserData["gridglobaluserdata"]){
			var keysAr = this.UserData["gridglobaluserdata"].getKeys()
			
			for (var i = 0;
				i < keysAr.length;
				i++)out+="<userdata name='"+keysAr[i]+"'>"+this.UserData["gridglobaluserdata"].get(keysAr[i])
				+"</userdata>";
		}
		
		if (this._sConfig)
			out+=this._serialiseConfig();
		out+=this._serialise();
		
		out+='</rows>';
		return out;
	}
	//#}
	//#}
	
	/**
	*    @desc: returns absolute left and top position of specified element
	*    @returns: array of two values: absolute Left and absolute Top positions
	*    @param: oNode - element to get position of
	*   @type: private
	*   @topic: 8
	*/
	this.getPosition=function(oNode, pNode){
		if (!pNode){
			var pos = dhx4.getOffset(oNode);
			return [pos.left, pos.top];
		}
		pNode = pNode||document.body;
		
		var oCurrentNode = oNode;
		var iLeft = 0;
		var iTop = 0;
		
		while ((oCurrentNode)&&(oCurrentNode != pNode)){ //.tagName!="BODY"){
			iLeft+=oCurrentNode.offsetLeft-oCurrentNode.scrollLeft;
			iTop+=oCurrentNode.offsetTop-oCurrentNode.scrollTop;
			oCurrentNode=oCurrentNode.offsetParent;
		}
		
		if (pNode == document.body){
			if (_isIE){
				iTop+=document.body.offsetTop||document.documentElement.offsetTop;
				iLeft+=document.body.offsetLeft||document.documentElement.offsetLeft;
			} else if (!_isFF){
				iLeft+=document.body.offsetLeft;
				iTop+=document.body.offsetTop;
			}
		}
		return [iLeft, iTop];
	}
	/**
	*   @desc: gets nearest parent of specified type
	*   @param: obj - input object
	*   @param: tag - string. tag to find as parent
	*   @returns: object. nearest paraent object (including spec. obj) of specified type.
	*   @type: private
	*   @topic: 8
	*/
	this.getFirstParentOfType=function(obj, tag){
		while (obj&&obj.tagName != tag&&obj.tagName != "BODY"){
			obj=obj.parentNode;
		}
		return obj;
	}
	
	
	
	/*INTERNAL EVENT HANDLERS*/
	/*ORIGINAL
	this.objBox.onscroll=function(){
		this.grid._doOnScroll();
	};
	*/
	
	/*HSITX*/
	if(xuic.__CONFIG.browserName === "MSIE"){
		var _scrollFn	= this._doOnScroll;
		this.objBox.addEventListener("scroll", xui.util.throttle(_scrollFn, 50));
	}else{
		this.objBox.onscroll=function(){
			this.grid._doOnScroll();
		};
	}
	/**/
	
	this.hdrBox.onscroll=function(){
		if (this._try_header_sync) return;
		this._try_header_sync = true;
		if (Math.abs(this.grid.objBox.scrollLeft - this.scrollLeft)>1){
			this.grid.objBox.scrollLeft = this.scrollLeft;
		}
		this._try_header_sync = false;
	}
	//#column_resize:06042008{
	if ((!_isOpera)||(_OperaRv > 8.5)){
		this.hdr.onmousemove=function(e){
			this.grid.changeCursorState(e||window.event);
		};
		this.hdr.onmousedown=function(e){
			return this.grid.startColResize(e||window.event);
		};		
	}
	//#}
	//#tooltips:06042008{
	/*ORIGINAL
	this.obj.onmousemove=this._drawTooltip;
	*/
	
	//#}
	this.objBox.onclick=function(e){
		e = e||event;
		e.cancelBubble=true;
		this.firstChild.grid.setActive(true);
		window.dhx4.callEvent("_onGridClick", [e, this.firstChild.grid]);
	};
	this.obj.onclick=function(e){
		if (this.grid._doClick(e||window.event) !== false){
			if (this.grid._sclE) 
				this.grid.editCell(e||window.event); 
			else
				this.grid.editStop();
		}
		
		e = e||event;
		e.cancelBubble=true;
		window.dhx4.callEvent("_onGridClick", [e, this.grid]);
	};
	//#context_menu:06042008{
	if (_isMacOS){
		this.entBox.oncontextmenu=function(e){
			e.cancelBubble=true;
			if (e.preventDefault) e.preventDefault(); else e.returnValue=false;
			var that = this.grid; if (that._realfake) that = that._fake;
			return that._doContClick(e||window.event);
		};
	} else {
		this.entBox.onmousedown=function(e){
			return this.grid._doContClick(e||window.event);
		};
		this.entBox.oncontextmenu=function(e){
			if (this.grid._ctmndx)
				(e||event).cancelBubble=true;
			return !this.grid._ctmndx;
		};
	}
		
	//#}		
	this.obj.ondblclick=function(e){
		if (!this.grid.wasDblClicked(e||window.event)) 
			return false; 
		if (this.grid._dclE) {
			var row = this.grid.getFirstParentOfType((_isIE?event.srcElement:e.target),"TR");
			if (row == this.grid.row)
				this.grid.editCell(e||window.event);  
		}
		(e||event).cancelBubble=true;
		if (_isOpera) return false; //block context menu for Opera 9+
	};
	this.hdr.onclick=this._onHeaderClick;
	this.sortImg.onclick=function(){
		self._onHeaderClick.apply({
				grid: self
		}, [
			null,
			self.r_fldSorted
		]);
	};
	
	this.hdr.ondblclick=this._onHeaderDblClick;
	
	
	if (!document.body._dhtmlxgrid_onkeydown){
		dhtmlxEvent(document, "keydown",function(e){
				if (globalActiveDHTMLGridObject) 
					return globalActiveDHTMLGridObject.doKey(e||window.event);
		});
		document.body._dhtmlxgrid_onkeydown=true;
	}
	
	dhtmlxEvent(document.body, "click", function(){
			if (self.editStop) self.editStop();
			if (self.isActive) self.setActive(false);
	});
	
	
	if (this.entBox.style.height.toString().indexOf("%") != -1)
		this._delta_y = this.entBox.style.height;
	if (this.entBox.style.width.toString().indexOf("%") != -1)
		this._delta_x = this.entBox.style.width;
	
	if (this._delta_x||this._delta_y)
		this._setAutoResize();
	
	
	/* deprecated names */
	this.setColHidden=this.setColumnsVisibility
	this.enableCollSpan = this.enableColSpan
	this.setMultiselect=this.enableMultiselect;
	this.setMultiLine=this.enableMultiline;
	this.deleteSelectedItem=this.deleteSelectedRows;
	this.getSelectedId=this.getSelectedRowId;
	this.getHeaderCol=this.getColumnLabel;
	this.isItemExists=this.doesRowExist;
	this.getColumnCount=this.getColumnsNum;
	this.setSelectedRow=this.selectRowById;
	this.setHeaderCol=this.setColumnLabel;
	this.preventIECashing=this.preventIECaching;
	this.enableAutoHeigth=this.enableAutoHeight;
	this.getUID=this.uid;
	
	if (dhtmlx.image_path) this.setImagePath(dhtmlx.image_path);
	if (dhtmlx.skin) this.setSkin(dhtmlx.skin);
	
	return this;
}

dhtmlXGridObject.prototype={
	getRowAttribute: function(id, name){
		return this.getRowById(id)._attrs[name];
	},
	setRowAttribute: function(id, name, value){
		this.getRowById(id)._attrs[name]=value;
	},
	/**
	*   @desc: detect is current grid is a treeGrid
	*   @type: private
	*   @topic: 2
	*/
	isTreeGrid:function(){
		return (this.cellType._dhx_find("tree") != -1);
	},
	
	//#column_hidden:21092006{	
	/**
	*   @desc: hide/show row (warning! - this command doesn't affect row indexes, only visual appearance)
	*   @param: ind - column index
	*   @param: state - true/false - hide/show row
	*   @type:  public
	*/
	setRowHidden:function(id, state){
		var f = dhx4.s2b(state);
		//var ind=this.getRowIndex(id);
		//if (id<0)
		//   return;
		var row = this.getRowById(id) //this.rowsCol[ind];
		
		if (!row)
			return;
		
		if (row.expand === "")
			this.collapseKids(row);
		
		if ((state)&&(row.style.display != "none")){
			row.style.display="none";
			var z = this.selectedRows._dhx_find(row);
			
			if (z != -1){
				row.className=row.className.replace("rowselected", "");
				
				for (var i = 0;
					i < row.childNodes.length;
					i++)row.childNodes[i].className=row.childNodes[i].className.replace(/cellselected/g, "");
					this.selectedRows._dhx_removeAt(z);
			}
			this.callEvent("onGridReconstructed", []);
		}
		
		if ((!state)&&(row.style.display == "none")){
			row.style.display="";
			this.callEvent("onGridReconstructed", []);
		}
		this.callEvent("onRowHide",[id, state]);
		this.setSizes();
	},
	
	//#__pro_feature:21092006{
	/**
	*   @desc: hide/show column
	*   @param: ind - column index
	*   @param: state - true/false - hide/show column
	*   @type:  public
	*   @edition: Professional
	*/
	setColumnHidden:function(ind, state){
		if (!this.hdr.rows.length){
			if (!this._ivizcol)
				this._ivizcol=[];
			return this._ivizcol[ind]=state;
		}
		
		if ((this.fldSorted)&&(this.fldSorted.cellIndex == ind)&&(state))
			this.sortImg.style.display="none";
		
		var f = dhx4.s2b(state);
		
		if (f){
			if (!this._hrrar)
				this._hrrar=new Array();
			
			else if (this._hrrar[ind])
				return;
			this._hrrar[ind]="display:none;";
			this._hideShowColumn(ind, "none");
		} else {
			if ((!this._hrrar)||(!this._hrrar[ind]))
				return;
			this._hrrar[ind]="";
			this._hideShowColumn(ind, "");
		}
		
		if ((this.fldSorted)&&(this.fldSorted.cellIndex == ind)&&(!state))
			this.sortImg.style.display="inline";
		
		this.setSortImgPos();
		this.callEvent("onColumnHidden",[ind,state])
	},
	
	
	/**
	*   @desc: get show/hidden status of column
	*   @param: ind - column index
	*   @type:  public
	*   @edition: Professional
	*   @returns:  if column hidden then true else false
	*/
	isColumnHidden:function(ind){
		if ((this._hrrar)&&(this._hrrar[ind]))
			return true;
		
		return false;
	},
	/**
	*   @desc: set list of visible/hidden columns
	*   @param: list - list of true/false separated by comma
	*   @type:  public
	*	@newmethod: setColumnsVisibility
	*   @edition: Professional
	*   @topic:0
	*/
	setColumnsVisibility:function(list){
		if (list)
			this._ivizcol=list.split(this.delim);
		
		if (this.hdr.rows.length&&this._ivizcol)
			for (var i = 0; i < this._ivizcol.length; i++)this.setColumnHidden(i, this._ivizcol[i]);
	},
	/**
	*   @desc: fix hidden state for column in all rows
	*   @type: private
	*/
	_fixHiddenRowsAll:function(pb, ind, prop, state, index){
		index=index||"_cellIndex";
		var z = pb.rows.length;
		
		for (var i = 0; i < z; i++){
			var x = pb.rows[i].childNodes;
			
			if (x.length != this._cCount){
				for (var j = 0; j < x.length; j++)
				if (x[j][index] == ind){
					x[j].style[prop]=state;
					break;
				}
			} else
			x[ind].style[prop]=state;
		}
	},
	/**
	*   @desc: hide column
	*   @param: ind - column index
	*   @param: state - hide/show
	*   @edition: Professional
	*   @type:  private
	*/
	_hideShowColumn:function(ind, state){
		var hind = ind;
		
		if (this.hdr.rows[1] && (this.hdr.rows[1]._childIndexes)&&(this.hdr.rows[1]._childIndexes[ind] != ind))
			hind=this.hdr.rows[1]._childIndexes[ind];
		
		if (state == "none"){
			this.hdr.rows[0].cells[ind]._oldWidth=this.hdr.rows[0].cells[ind].style.width||(this.initCellWidth[ind]+"px");
			this.hdr.rows[0].cells[ind]._oldWidthP=this.cellWidthPC[ind];
			this.obj.rows[0].cells[ind].style.width="0px";
			
			
			var t={rows:[this.obj.rows[0]]}
			this.forEachRow(function(id){
					if (this.rowsAr[id].tagName=="TR")
						t.rows.push(this.rowsAr[id])
			})
			this._fixHiddenRowsAll(t, ind, "display", "none");
			
			if (this.isTreeGrid())
				this._fixHiddenRowsAllTG(ind, "none");
			
			if ((_isOpera&&_OperaRv < 9)||_isKHTML||(_isFF)){ 
				this._fixHiddenRowsAll(this.hdr, ind, "display", "none","_cellIndexS");
				
			}
			if (this.ftr)
				this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "none");			
			this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "nowrap","_cellIndexS");
			
			if (!this.cellWidthPX.length&&!this.cellWidthPC.length)
				this.cellWidthPX=[].concat(this.initCellWidth);
			
			if (this.cellWidthPX[ind])
				this.cellWidthPX[ind]=0;
			
			if (this.cellWidthPC[ind])
				this.cellWidthPC[ind]=0;
		} else {
			if (this.hdr.rows[0].cells[ind]._oldWidth){
				var zrow = this.hdr.rows[0].cells[ind];
				
				if (_isOpera||_isKHTML||(_isFF))
					this._fixHiddenRowsAll(this.hdr, ind, "display", "","_cellIndexS");
				
				if (this.ftr)
					this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "");
				
				
				var t={rows:[this.obj.rows[0]]}
				this.forEachRow(function(id){
						if (this.rowsAr[id].tagName=="TR")
							t.rows.push(this.rowsAr[id])
				})
				this._fixHiddenRowsAll(t, ind, "display", "");
				
				if (this.isTreeGrid())
					this._fixHiddenRowsAllTG(ind, "");
				
				this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "normal","_cellIndexS");
				
				if (zrow._oldWidthP)
					this.cellWidthPC[ind]=zrow._oldWidthP;
				
				if (zrow._oldWidth)
					this.cellWidthPX[ind]=parseInt(zrow._oldWidth);
			}
		}

		if (!state && this._realfake)
			this.setColumnSizes(this.entBox.clientWidth);

		this.setSizes();
		
		if ((!_isIE)&&(!_isFF)){
			//dummy Opera/Safari fix
			this.obj.border=1;
			this.obj.border=0;
		}
	},
	//#}	
	//#}
	//#__pro_feature:21092006{	
	//#colspan:20092006{
	/**
	*   @desc: enable/disable colspan support
	*   @param: mode - true/false
	*   @type:  public
	*   @edition: Professional
	*/
	enableColSpan:function(mode){
		this._ecspn=dhx4.s2b(mode);
	},
	//#}
	//#}
	//#hovering:060402008{	
	/**
	*   @desc: enable/disable hovering row on mouse over
	*   @param: mode - true/false
	*   @param: cssClass - css class for hovering row
	*   @type:  public
	*/
	enableRowsHover:function(mode, cssClass){
		this._unsetRowHover(false,true);
		this._hvrCss=cssClass;
		
		if (dhx4.s2b(mode)){
			if (!this._elmnh){
				this.obj._honmousemove=this.obj.onmousemove;
				this.obj.onmousemove=this._setRowHover;
				
				if (_isIE)
					this.obj.onmouseleave=this._unsetRowHover;
				else
					this.obj.onmouseout=this._unsetRowHover;
				
				this._elmnh=true;
			}
		} else {
			if (this._elmnh){
				this.obj.onmousemove=this.obj._honmousemove;
				
				if (_isIE)
					this.obj.onmouseleave=null;
				else
					this.obj.onmouseout=null;
				
				this._elmnh=false;
			}
		}
	},
	//#}	
	/**
	*   @desc: enable/disable events which fire excell editing, mutual exclusive with enableLightMouseNavigation
	*   @param: click - true/false - enable/disable editing by single click
	*   @param: dblclick - true/false - enable/disable editing by double click
	*   @param: f2Key - enable/disable editing by pressing F2 key
	*   @type:  public
	*/
	enableEditEvents:function(click, dblclick, f2Key){
		this._sclE=dhx4.s2b(click);
		this._dclE=dhx4.s2b(dblclick);
		this._f2kE=dhx4.s2b(f2Key);
	},
	
	//#hovering:060402008{	
	/**
	*   @desc: enable/disable light mouse navigation mode (row selection with mouse over, editing with single click), mutual exclusive with enableEditEvents
	*   @param: mode - true/false
	*   @type:  public
	*/
	enableLightMouseNavigation:function(mode){
		if (dhx4.s2b(mode)){
			if (!this._elmn){
				this.entBox._onclick=this.entBox.onclick;
				this.entBox.onclick=function(){
					return true;
				};
				
				this.obj._onclick=this.obj.onclick;
				this.obj.onclick=function(e){
					var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
					if (!c) return;
					this.grid.editStop();
					this.grid.doClick(c);
					this.grid.editCell();
					(e||event).cancelBubble=true;
				}
				
				this.obj._onmousemove=this.obj.onmousemove;
				this.obj.onmousemove=this._autoMoveSelect;
				this._elmn=true;
			}
		} else {
			if (this._elmn){
				this.entBox.onclick=this.entBox._onclick;
				this.obj.onclick=this.obj._onclick;
				this.obj.onmousemove=this.obj._onmousemove;
				this._elmn=false;
			}
		}
	},
	
	
	/**
	*   @desc: remove hover state on row
	*   @type:  private
	*/
	_unsetRowHover:function(e, c){
		if (c)
			that=this;
		else
			that=this.grid;
		
		if ((that._lahRw)&&(that._lahRw != c)){
			for (var i = 0;
				i < that._lahRw.childNodes.length;
				i++)that._lahRw.childNodes[i].className=that._lahRw.childNodes[i].className.replace(that._hvrCss, "");
				that._lahRw=null;
		}
	},
	
	/**
	*   @desc: set hover state on row
	*   @type:  private
	*/
	_setRowHover:function(e){
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
		
		if (c && c.parentNode!=this.grid._lahRw) {
			this.grid._unsetRowHover(0, c);
			c=c.parentNode;
			if (!c.idd || c.idd=="__filler__") return;
			for (var i = 0; i < c.childNodes.length; i++)c.childNodes[i].className+=" "+this.grid._hvrCss;
			this.grid._lahRw=c;
		}
		this._honmousemove(e);
	},
	
	/**
	*   @desc: onmousemove, used in light mouse navigaion mode
	*   @type:  private
	*/
	_autoMoveSelect:function(e){
		//this - grid.obj
		if (!this.grid.editor){
			var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
			
			if (c.parentNode.idd)
				this.grid.doClick(c, true, 0);
		}
		this._onmousemove(e);
	},
	//#}	
	//#__pro_feature:21092006{
	//#distrb_parsing:21092006{
	/**
	*   @desc: enable/disable distributed parsing (rows paresed portion by portion with some timeout)
	*   @param: mode - true/false
	*   @param: count - count of nodes parsed by one step (the 10 by default)
	*   @param: time - time between parsing counts in milli seconds (the 250 by default)
	*   @type:  public
	*   @edition: Professional
	*/
	enableDistributedParsing:function(mode, count, time){
		if (dhx4.s2b(mode)){
			this._ads_count=count||10;
			this._ads_time=time||250;
		} else
		this._ads_count=0;
	},
	//#}
	//#}
	/**
	*     @desc: destructor, removes grid and cleans used memory
	*     @type: public
	*     @topic: 0
	*/
	destructor:function(){
		this.editStop(true);
		//add links to current object
		if (this._sizeTime)
			this._sizeTime=window.clearTimeout(this._sizeTime);
		this.entBox.className=(this.entBox.className||"").replace(/gridbox.*/,"");
		if (this.formInputs)
			for (var i = 0; i < this.formInputs.length; i++)this.parentForm.removeChild(this.formInputs[i]);
		
		var a;
		
		for (var i = 0; i < this.rowsCol.length; i++)
			if (this.rowsCol[i])
			this.rowsCol[i].grid=null;
		
		for (i in this.rowsAr)
			if (this.rowsAr[i])
			this.rowsAr[i]=null;
		
		this.rowsCol=new dhtmlxArray();
		this.rowsAr={};
		this.entBox.innerHTML="";
		
		var dummy=function(){};
		this.entBox.onclick = this.entBox.onmousedown = this.entBox.onbeforeactivate = this.entBox.onbeforedeactivate = this.entBox.onbeforedeactivate = this.entBox.onselectstart = dummy;
		this.setSizes = this._update_srnd_view = this.callEvent = dummy;
		this.entBox.grid=this.objBox.grid=this.hdrBox.grid=this.obj.grid=this.hdr.grid=null;
		if (this._fake){
			this.globalBox.innerHTML = "";
			this._fake.setSizes = this._fake._update_srnd_view = this._fake.callEvent = dummy;
			this.globalBox.onclick = this.globalBox.onmousedown = this.globalBox.onbeforeactivate = this.globalBox.onbeforedeactivate = this.globalBox.onbeforedeactivate = this.globalBox.onselectstart = dummy;
		}
		
		for (a in this){
			if ((this[a])&&(this[a].m_obj))
				this[a].m_obj=null;
			this[a]=null;
		}
		
		if (this == globalActiveDHTMLGridObject)
			globalActiveDHTMLGridObject=null;
		//   self=null;
		return null;
	},
	
	//#sorting:06042008{	
	/**
	*     @desc: get sorting state of grid
	*     @type: public
	*     @returns: array, first element is index of sortef column, second - direction of sorting ("asc" or "des").
	*     @topic: 0
	*/
	getSortingState:function(){
		var z = new Array();
		
		if (this.fldSorted){
			z[0]=this.fldSorted._cellIndex;
			z[1]=(this.sortImg.className == "dhxgrid_sort_desc" ? "des" : "asc");
		}
		return z;
	},
	//#}
	
	/**
	*     @desc: enable autoheight of grid
	*     @param: mode - true/false
	*     @param: maxHeight - maximum height before scrolling appears (no limit by default)
	*     @param: countFullHeight - control the usage of maxHeight parameter - when set to true all grid height included in max height calculation, if false then only data part (no header) of grid included in calcualation (false by default)
	*     @type: public
	*     @topic: 0
	*/
	enableAutoHeight:function(mode, maxHeight, countFullHeight){
		this._ahgr=dhx4.s2b(mode);
		this._ahgrF=dhx4.s2b(countFullHeight);
		this._ahgrM=maxHeight||null;
		if (arguments.length == 1){
			this.objBox.style.overflowY=mode?"hidden":"auto";
		}
		if (maxHeight == "auto"){
			this._ahgrM=null;
			this._ahgrMA=true;
			this._setAutoResize();
			//   this._activeResize();
		}
	},
	//#sorting:06042008{	
	enableStableSorting:function(mode){
		this._sst=dhx4.s2b(mode);
		this.rowsCol.stablesort=function(cmp){
			var size = this.length-1;
			
			for (var i = 0; i < this.length-1; i++){
				for (var j = 0; j < size; j++)
				if (cmp(this[j], this[j+1]) > 0){
					var temp = this[j];
					this[j]=this[j+1];
					this[j+1]=temp;
				}
				size--;
			}
		}
	},
	//#}
	
	/**
	*     @desc: enable/disable hot keys in grid
	*     @param: mode - true/false
	*     @type: public
	*     @topic: 0
	*/
	enableKeyboardSupport:function(mode){
		this._htkebl=!dhx4.s2b(mode);
	},
	
	//#context_menu:06042008{	
	/**
	*     @desc: enable/disable context menu
	*     @param: dhtmlxMenu object, if null - context menu will be disabled
	*     @type: public
	*     @topic: 0
	*/
	enableContextMenu:function(menu){
		this._ctmndx=menu;
	},
	//#}	
	
	/*backward compatibility*/
	setScrollbarWidthCorrection:function(width){
	},
	//#tooltips:06042008{	
	/**
	*     @desc: enable/disable tooltips for specified colums
	*     @param: list - list of true/false values, tooltips enabled for all columns by default
	*     @type: public
	*     @topic: 0
	*/
	enableTooltips:function(list){
		this._enbTts=list.split(",");
		
		for (var i = 0; i < this._enbTts.length; i++)this._enbTts[i]=dhx4.s2b(this._enbTts[i]);
	},
	//#}	
	
	//#column_resize:06042008{
	/**
	*     @desc: enable/disable resizing for specified colums
	*     @param: list - list of true/false values, resizing enabled for all columns by default
	*     @type: public
	*     @topic: 0
	*/
	enableResizing:function(list){
		this._drsclmn=list.split(",");
		
		for (var i = 0; i < this._drsclmn.length; i++)this._drsclmn[i]=dhx4.s2b(this._drsclmn[i]);
	},
	
	/**
	*     @desc: set minimum column width ( works only for manual resizing )
	*     @param: width - minimum column width, can be set for specified column, or as comma separated list for all columns
	*     @param: ind - column index
	*     @type: public
	*     @topic: 0
	*/
	setColumnMinWidth:function(width, ind){
		if (arguments.length == 2){
			if (!this._drsclmW)
				this._drsclmW=new Array();
			this._drsclmW[ind]=width;
		} else
		this._drsclmW=width.split(",");
	},
	//#}	
	
	/**
	*     @desc: enable/disable unique id for cells (id will be automaticaly created using the following template: "c_[RowId]_[colIndex]")
	*     @param: mode - true/false - enable/disable
	*     @type: public
	*     @topic: 0
	*/
	enableCellIds:function(mode){
		this._enbCid=dhx4.s2b(mode);
	},
	
	
	//#locked_row:11052006{
	/**
	*     @desc: lock/unlock row for editing
	*     @param: rowId - id of row
	*     @param: mode - true/false - lock/unlock
	*     @type: public
	*     @topic: 0
	*/
	lockRow:function(rowId, mode){
		var z = this.getRowById(rowId);
		
		if (z){
			z._locked=dhx4.s2b(mode);
			
			if ((this.cell)&&(this.cell.parentNode.idd == rowId))
				this.editStop();
		}
	},
	//#}
	
	/**
	*   @desc:  get values of all cells in row
	*   @type:  private
	*/
	_getRowArray:function(row){
		var text = new Array();
		
		for (var ii = 0; ii < row.childNodes.length; ii++){
			var a = this.cells3(row, ii);
			text[ii]=a.getValue();
		}
		
		return text;
	},
	//#__pro_feature:21092006{	
	//#data_format:12052006{
	/**
	*     @desc: set mask for date formatting in cell
	*     @param: mask - date mask, d,m,y will mean day,month,year; for example "d/m/y" - 22/05/1985
	*     @type: public
	*     @edition: Professional
	*     @topic: 0
	*/
	setDateFormat:function(mask,incoming){
		this._dtmask=mask;
		this._dtmask_inc=incoming;
	},
	
	/**
	*     @desc: set mask for formatting numeric data ( works for [ed/ro]n excell only or oher cell types with suport for this method)
	*     @param: mask - numeric mask; for example 0,000.00 - 1,234.56
	*     @param: cInd - column index
	*     @param: p_sep - char used as decimalseparator ( point by default )
	*     @param: d_sep - char used as groups part separator ( comma by default )
	*     @type: public
	*     @edition: Professional
	*     @topic: 0
	*/
	setNumberFormat:function(mask, cInd, p_sep, d_sep){
		var nmask = mask.replace(/[^0\,\.]*/g, "");
		var pfix = nmask.indexOf(".");
		
		if (pfix > -1)
			pfix=nmask.length-pfix-1;
		var dfix = nmask.indexOf(",");
		
		if (dfix > -1)
			dfix=nmask.length-pfix-2-dfix;
		if (typeof p_sep != "string")
			p_sep=this.i18n.decimal_separator;
		if (typeof d_sep != "string")
			d_sep=this.i18n.group_separator;
		var pref = mask.split(nmask)[0];
		var postf = mask.split(nmask)[1];
		this._maskArr[cInd]=[
			pfix,
			dfix,
			pref,
			postf,
			p_sep,
			d_sep
		];
	},
	/**
	*   @desc:  convert formated value to original
	*   @type:  private
	*/
	_aplNFb:function(data, ind){
		var a = this._maskArr[ind];
		
		if (!a)
			return data;
		
		var ndata = parseFloat(data.toString().replace(/[^0-9]*/g, ""));
		
		if (data.toString().substr(0, 1) == "-")
			ndata=ndata*-1;
		
		if (a[0] > 0)
			ndata=ndata / Math.pow(10, a[0]);
		return ndata;
	},
	
	/**
	*   @desc:  format data with mask
	*   @type:  private
	*/
	_aplNF:function(data, ind){
		var a = this._maskArr[ind];
		
		if (!a)
			return data;
		
		var c = (parseFloat(data) < 0 ? "-" : "")+a[2];
		data=Math.abs(Math.round(parseFloat(data)*Math.pow(10, a[0] > 0 ? a[0] : 0))).toString();
		data=(data.length
			< a[0]
			? Math.pow(10, a[0]+1-data.length).toString().substr(1, a[0]+1)+data.toString()
			: data).split("").reverse();
			data[a[0]]=(data[a[0]]||"0")+a[4];
			
			if (a[1] > 0)
				for (var j = (a[0] > 0 ? 0 : 1)+a[0]+a[1]; j < data.length; j+=a[1])data[j]+=a[5];
			return c+data.reverse().join("")+a[3];
	},
	//#}
	//#}	
	
	//#config_from_xml:20092006{
	
	/**
	*   @desc:  configure grid structure from XML
	*   @type:  private
	*/
	_launchCommands:function(arr){
		for (var i = 0; i < arr.length; i++){
			var args = new Array();
			
			for (var j = 0; j < arr[i].childNodes.length; j++)
				if (arr[i].childNodes[j].nodeType == 1)
				args[args.length]=arr[i].childNodes[j].firstChild.data;
			
			this[arr[i].getAttribute("command")].apply(this, args);
		}
	},
	
	
	/**
	*   @desc:  configure grid structure from XML
	*   @type:  private
	*/
	_parseHead:function(xmlDoc){
		var hheadCol = dhx4.ajax.xpath("./head", xmlDoc);
		
		if (hheadCol.length){
			var headCol = dhx4.ajax.xpath("./column", hheadCol[0]);
			var asettings = dhx4.ajax.xpath("./settings", hheadCol[0]);
			var awidthmet = "setInitWidths";
			var split = false;
			
			if (asettings[0]){
				for (var s = 0; s < asettings[0].childNodes.length; s++)switch (asettings[0].childNodes[s].tagName){
				case "colwidth":
					if (asettings[0].childNodes[s].firstChild&&asettings[0].childNodes[s].firstChild.data == "%")
						awidthmet="setInitWidthsP";
					break;
					
				case "splitat":
					split=(asettings[0].childNodes[s].firstChild ? asettings[0].childNodes[s].firstChild.data : false);
					break;
				}
			}
			this._launchCommands(dhx4.ajax.xpath("./beforeInit/call", hheadCol[0]));
			
			if (headCol.length > 0){
				if (this.hdr.rows.length > 0) this.clearAll(true); //drop existing grid here, to prevent loss of initialization parameters
				var sets = [
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				];
				
				var attrs = ["", "width", "type", "align", "sort", "color", "format", "hidden", "id"];
				var calls = ["", awidthmet, "setColTypes", "setColAlign", "setColSorting", "setColumnColor", "",
				"", "setColumnIds"];
				
				for (var i = 0; i < headCol.length; i++){
					for (var j = 1; j < attrs.length; j++)sets[j].push(headCol[i].getAttribute(attrs[j]));
					sets[0].push((headCol[i].firstChild
						? headCol[i].firstChild.data
						: "").replace(/^\s*((\s\S)*.+)\s*$/gi, "$1"));
				};
				
				this.setHeader(sets[0]);
				for (var i = 0; i < calls.length; i++)
					if (calls[i])
					this[calls[i]](sets[i].join(this.delim))
				
				for (var i = 0; i < headCol.length; i++){
					if ((this.cellType[i].indexOf('co') == 0)||(this.cellType[i] == "clist")){
						var optCol = dhx4.ajax.xpath("./option", headCol[i]);
						
						if (optCol.length){
							var resAr = new Array();
							
							if (this.cellType[i] == "clist"){
								for (var j = 0;
									j < optCol.length;
									j++)resAr[resAr.length]=optCol[j].firstChild
								? optCol[j].firstChild.data
								: "";
								
								this.registerCList(i, resAr);
							} else {
								var combo = this.getCombo(i);
								
								for (var j = 0;
									j < optCol.length;
									j++)combo.put(optCol[j].getAttribute("value"),
										optCol[j].firstChild
										? optCol[j].firstChild.data
										: "");
							}
						}
					}
					
					else if (sets[6][i])
						if ((this.cellType[i].toLowerCase().indexOf("calendar")!=-1)||(this.fldSort[i] == "date"))
						this.setDateFormat(sets[6][i]);
					else
						this.setNumberFormat(sets[6][i], i);
				}
				
				this.init();
				
				var param=sets[7].join(this.delim);
				//preserving state of hidden columns, if not specified directly
				if (this.setColHidden && param.replace(/,/g,"")!="")
					this.setColHidden(param);
				
				if ((split)&&(this.splitAt))
					this.splitAt(split);
			}
			this._launchCommands(dhx4.ajax.xpath("./afterInit/call", hheadCol[0]));
		}
		//global(grid) user data
		var gudCol = dhx4.ajax.xpath("//rows/userdata", xmlDoc);
		
		if (gudCol.length > 0){
			
			if (!this.UserData["gridglobaluserdata"])
				this.UserData["gridglobaluserdata"]=new Hashtable();
			
			for (var j = 0; j < gudCol.length; j++){
				var u_record = "";
				for (var xj=0; xj < gudCol[j].childNodes.length; xj++)
					u_record += gudCol[j].childNodes[xj].nodeValue;
				this.UserData["gridglobaluserdata"].put(gudCol[j].getAttribute("name"),u_record);
			}
		}
	},
	
	
	//#}
	
	
	/**
	*   @desc: get list of Ids of all rows with checked exCell in specified column
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/
	getCheckedRows:function(col_ind){
		var d = new Array();
		this.forEachRowA(function(id){
				var cell = this.cells(id, col_ind);
				if (cell.changeState && cell.getValue() != 0)
					d.push(id);
		},true);
		return d.join(",");
	},
	/**
	*   @desc: check all checkboxes in grid
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/	
	checkAll:function(){var mode=arguments.length?arguments[0]:1;
	for (var cInd=0;cInd<this.getColumnsNum();cInd++){if(this.getColType(cInd)=="ch")this.setCheckedRows(cInd,mode)}},
		/**
	*   @desc: uncheck all checkboxes in grid
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/	
	uncheckAll:function(){ this.checkAll(0); },
	/**
	*   @desc: set value for all checkboxes in specified column
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/	
	setCheckedRows:function(cInd,v){this.forEachRowA(function(id){if(this.cells(id,cInd).isCheckbox())this.cells(id,cInd).setValue(v)})},
	//#tooltips:06042008{	
	/**
	*   @desc:  grid body onmouseover function
	*   @type:  private
	*/
	_drawTooltip:function(e){
		/*ORIGINAL
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
		
		if (!c || ((this.grid.editor)&&(this.grid.editor.cell == c)))
			return true;
		
		var r = c.parentNode;
		
		if (!r.idd||r.idd == "__filler__")
			return;
		var el = (e ? e.target : event.srcElement);
		
		if (r.idd == window.unknown)
			return true;
		
		if (!this.grid.callEvent("onMouseOver", [
				r.idd,
			c._cellIndex,
			(e||window.event)
		]))
		return true;
		
		if ((this.grid._enbTts)&&(!this.grid._enbTts[c._cellIndex])){
			if (el.title)
				el.title='';
			return true;
		}
		
		if (c._cellIndex >= this.grid._cCount)
			return;
		var ced = this.grid.cells3(r, c._cellIndex);
		if (!ced || !ced.cell || !ced.cell._attrs) return; // fix for public release
		
		if (el._title)
			ced.cell.title="";
		
		if (!ced.cell._attrs['title'])
			el._title=true;
		
		if (ced)
			el.title=ced.cell._attrs['title']
		||(ced.getTitle
			? ced.getTitle()
			: (ced.getValue()||"").toString().replace(/<[^>]*>/gi, ""));
		
		return true;
		*/
		
		/*HSITX*/
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
		if (!c || ((this.grid.editor)&&(this.grid.editor.cell == c))){return;}
		var r = c.parentNode;
		if(!this.grid.callEvent("onMouseOver",[r.idd,c._cellIndex,(e||window.event)]));
		/**/
	},
	//#}	
	/**
	*   @desc:  can be used for setting correction for cell padding, while calculation setSizes
	*   @type:  private
	*/
	enableCellWidthCorrection:function(size){
		if (_isFF)
			this._wcorr=parseInt(size);
	},
	
	
	/**
	*	@desc: gets a list of all row ids in grid
	*	@param: separator - delimiter to use in list
	*	@returns: list of all row ids in grid
	*	@type: public
	*	@topic: 2,7
	*/
	getAllRowIds:function(separator){
		var ar = [];
		
		for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i])
			ar.push(this.rowsBuffer[i].idd);
		
		return ar.join(separator||this.delim)
	},
	getAllItemIds:function(){
		return this.getAllRowIds();
	},
	
	//#__pro_feature:21092006{	
	//#colspan:20092006{
	
	/**
	*   @desc: dynamicaly set colspan in row starting from specified column index
	*   @param: row_id - row id
	*   @param: col_id - index of column
	*   @param: colspan - size of colspan
	*   @type: public
	*   @edition: Professional
	*   @topic: 2,9
	*/
	setColspan:function(row_id, col_ind, colspan){
		if (!this._ecspn)
			return;
		
		var r = this.getRowById(row_id);
		
		if ((r._childIndexes)&&(r.childNodes[r._childIndexes[col_ind]])){
			var j = r._childIndexes[col_ind];
			var n = r.childNodes[j];
			var m = n.colSpan;
			n.colSpan=1;
			
			if ((m)&&(m != 1))
			for (var i = 1; i < m; i++){
				var c = document.createElement("TD");
				
				if (n.nextSibling)
					r.insertBefore(c, n.nextSibling);
				else
					r.appendChild(c);
				r._childIndexes[col_ind+i]=j+i;
				c._cellIndex=col_ind+i;
				c.style.textAlign=this.cellAlign[i];
				c.style.verticalAlign=this.cellVAlign[i];
				n=c;
				this.cells3(r, col_ind+i).setValue("");
			}
			
			for (var z = col_ind*1+1*m; z < r._childIndexes.length; z++){
				r._childIndexes[z]+=(m-1)*1;
			}
		}
		
		if ((colspan)&&(colspan > 1)){
			if (r._childIndexes)
				var j = r._childIndexes[col_ind];
			else {
				var j = col_ind;
				r._childIndexes=new Array();
				
				for (var z = 0; z < r.childNodes.length; z++)r._childIndexes[z]=z;
			}
			
			r.childNodes[j].colSpan=colspan;
			
			for (var z = 1; z < colspan; z++){
				r._childIndexes[r.childNodes[j+1]._cellIndex]=j;
				r.removeChild(r.childNodes[j+1]);
			}
			
			var c1 = r.childNodes[r._childIndexes[col_ind]]._cellIndex;
			
			for (var z = c1*1+1*colspan; z < r._childIndexes.length; z++)r._childIndexes[z]-=(colspan-1);
		}
	},
	
	//#}
	//#}
	
	/**
	*   @desc: prevent caching in IE  by adding random values to URL string
	*   @param: mode - enable/disable random values in URLs ( disabled by default )
	*   @type: public
	*   @topic: 2,9
	*/
	preventIECaching:function(mode){
		dhx4.ajax.cache = !mode;
	},
	enableColumnAutoSize:function(mode){
		this._eCAS=dhx4.s2b(mode);
	},
	/**
	*   @desc: called when header was dbllicked
	*   @type: private
	*   @topic: 1,2
	*/
	_onHeaderDblClick:function(e){
		var that = this.grid;
		var el = that.getFirstParentOfType(_isIE ? event.srcElement : e.target, "TD");
		
		if (!that._eCAS)
			return false;
		
		/*ORIGINAL
		that.adjustColumnSize(el._cellIndexS)
		*/
		
		/*HSITX*/
		if(el.style.cursor != "default"){
			that.adjustColumnSize(el._cellIndexS);
		}
		/**/
	},
	
	/**
	*   @desc: autosize column  to max content size
	*   @param: cInd - index of column
	*   @type:  public
	*/
	adjustColumnSize:function(cInd, complex){
		if (this._hrrar && this._hrrar[cInd]) return;
		this._notresize=true;
		var m = 0;
		this._setColumnSizeR(cInd, 20);
		
		for (var j = 1; j < this.hdr.rows.length; j++){
			var a = this.hdr.rows[j];
			a=a.childNodes[(a._childIndexes) ? a._childIndexes[cInd] : cInd];
			
			if ((a)&&((!a.colSpan)||(a.colSpan < 2)) && a._cellIndex==cInd){
				if ((a.childNodes[0])&&(a.childNodes[0].className == "hdrcell"))
					a=a.childNodes[0];
				m=Math.max(m, a.scrollWidth);
			}
		}
		
		var l = this.obj.rows.length;
		var z = 0;
		var tree = this.cellType._dhx_find("tree");

		var d = document.createElement("DIV");
		d.className = "dhx_grid_adjust";
		d.style.cssText = "width:auto;height:auto;visibility:hidden; position:absolute; top:0px; left:0px; overflow:hidden; white-space:nowrap;";
		document.body.appendChild(d);

		for (var i = 1; i < l; i++){
			var row = this.obj.rows[i];
			var col = cInd;
			if (!this.rowsAr[row.idd]) continue;
			
			if (row._childIndexes){
				if (row._childIndexes[cInd] == row._childIndexes[cInd+1] )
					continue;
				col = row._childIndexes[cInd];
			}

			if (!row.childNodes[col] || row.childNodes[col]._cellIndex != cInd)
				continue;

			d.innerHTML = ( row.childNodes[col].innerText || row.childNodes[col].textContent || "" );
			z = d.offsetWidth;
			if (this._h2 && cInd == tree)
				z += this._h2.get[row.idd].level * 22;
			
			
			
			if (z > m)
				m=z;
		}

		document.body.removeChild(d);

		m+=20+(complex||0);
		
		this._setColumnSizeR(cInd, m);
		this._notresize=false;
		this.setSizes();
	},
	
	//#header_footer:06042008{
	/**
	*   @desc: remove header line from grid (opposite to attachHeader)
	*   @param: index - index of row to be removed ( zero based )
	*	@param: hdr - header object (optional)
	*   @type:  public
	*/
	detachHeader:function(index, hdr){
		hdr=hdr||this.hdr;
		var row = hdr.rows[index+1];
		
		if (row)
			row.parentNode.removeChild(row);
		this.setSizes();
	},
	
	/**
	*   @desc: remove footer line from grid (opposite to attachFooter)
	*   @param: values - array of header titles
	*   @type:  public
	*/
	detachFooter:function(index){
		this.detachHeader(index, this.ftr);
	},
	
	/**
	*   @desc: attach additional line to header
	*   @param: values - array of header titles
	*   @param: style - array of styles, optional
	*	@param: _type - reserved
	*   @type:  public
	*/
	attachHeader:function(values, style, _type, customClass){
		if (typeof (values) == "string")
			values=this._eSplit(values);
		
		if (typeof (style) == "string")
			style=style.split(this.delim);
		/*HSITX*/
		if (typeof (customClass) == "string")
			customClass=customClass.split(this.delim);
		/**/
		_type=_type||"_aHead";
		
		if (this.hdr.rows.length){
			if (values)
			this._createHRow([
					values,
					style,
					customClass
				], this[(_type == "_aHead") ? "hdr" : "ftr"]);
			
			else if (this[_type])
				for (var i = 0; i < this[_type].length; i++)this.attachHeader.apply(this, this[_type][i]);
		} else {
			if (!this[_type])
				this[_type]=new Array();
			this[_type][this[_type].length]=[
				values,
				style,
				_type,
				customClass
			];
		}
	},
	/**
	*	@desc:
	*	@type: private
	*/
	_createHRow:function(data, parent){
		if (!parent){
			if (this.entBox.style.position!="absolute")
				this.entBox.style.position="relative";
			var z = document.createElement("DIV");
			z.className="c_ftr".substr(2);
			this.entBox.appendChild(z);
			var t = document.createElement("TABLE");
			t.cellPadding=t.cellSpacing=0;
			
			if (!_isIE || _isIE == 8){
				t.width="100%";
				t.style.paddingRight="20px";
			}
			t.style.marginRight="20px";
			t.style.tableLayout="fixed";
			
			z.appendChild(t);
			t.appendChild(document.createElement("TBODY"));
			this.ftr=parent=t;
			
			var hdrRow = t.insertRow(0);
			var thl = ((this.hdrLabels.length <= 1) ? data[0].length : this.hdrLabels.length);
			
			for (var i = 0; i < thl; i++){
				hdrRow.appendChild(document.createElement("TH"));
				hdrRow.childNodes[i]._cellIndex=i;
			}
			
			if (_isIE && _isIE<8)
				hdrRow.style.position="absolute";
			else
				hdrRow.style.height='auto';
		}
		var st1 = data[1];
		var classes	= data[2];
		var z = document.createElement("TR");
		parent.rows[0].parentNode.appendChild(z);
		
		for (var i = 0; i < data[0].length; i++){
			if (data[0][i] == "#cspan"){
				var pz = z.cells[z.cells.length-1];
				pz.colSpan=(pz.colSpan||1)+1;
				continue;
			}
			
			if ((data[0][i] == "#rspan")&&(parent.rows.length > 1)){
				var pind = parent.rows.length-2;
				var found = false;
				var pz = null;
				
				while (!found){
					var pz = parent.rows[pind];
					
					for (var j = 0; j < pz.cells.length; j++)
					if (pz.cells[j]._cellIndex == i){
						found=j+1;
						break;
					}
					pind--;
				}
				
				pz=pz.cells[found-1];
				pz.rowSpan=(pz.rowSpan||1)+1;
				continue;
				//            data[0][i]="";
			}
			
			var w = document.createElement("TD");
			w._cellIndex=w._cellIndexS=i;
			if (this._hrrar && this._hrrar[i] && !_isIE)
				w.style.display='none';
			
			if (typeof data[0][i] == "object")
				w.appendChild(data[0][i]);
			else {
				if (this.forceDivInHeader)
					w.innerHTML="<div class='hdrcell'>"+(data[0][i]||"&nbsp;")+"</div>";
				else
					w.innerHTML=(data[0][i]||"&nbsp;");
				
				if ((data[0][i]||"").indexOf("#") != -1){
					var t = data[0][i].match(/(^|{)#([^}]+)(}|$)/);
					
					if (t){
						var tn = "_in_header_"+t[2];
						
						if (this[tn])
							this[tn]((this.forceDivInHeader ? w.firstChild : w), i, data[0][i].split(t[0]));
					}
				}
			}
			if (st1)
				w.style.cssText=st1[i];
			
			/*HSITX*/
			if (classes && typeof(classes[i]) !== "undefined" && classes[i] !== ""){
				w.classList.add(classes[i]);
			}
			/**/
			
			z.appendChild(w);
		}
		var self = parent;
		
		if (_isKHTML){
			if (parent._kTimer)
				window.clearTimeout(parent._kTimer);
			parent._kTimer=window.setTimeout(function(){
					parent.rows[1].style.display='none';
					window.setTimeout(function(){
							parent.rows[1].style.display='';
					}, 1);
			}, 500);
		}
	},
	//#__pro_feature:21092006{	
	/**
	*   @desc: attach additional line to footer
	*   @param: values - array of header titles
	*   @param: style - array of styles, optional
	*   @edition: Professional
	*   @type:  public
	*/
	attachFooter:function(values, style){
		this.attachHeader(values, style, "_aFoot");
	},
	//#}
	//#}
	//#__pro_feature:21092006{
	//#dyn_cell_types:04062008{
	/**
	*   @desc: set excell type for cell in question
	*   @param: rowId - row ID
	*   @param: cellIndex - cell index
	*   @param: type - type of excell (code like "ed", "txt", "ch" etc.)
	*   @edition: Professional
	*   @type:  public
	*/
	setCellExcellType:function(rowId, cellIndex, type){
		this.changeCellType(this.getRowById(rowId), cellIndex, type);
	},
	getCellExcellType:function(rowId, cellIndex) {
	    var row = this.getRowById(rowId);
	    var z = this.cells3(row, cellIndex);
	    return z.cell._cellType || this.cellType[cellIndex];
	},
	/**
	*	@desc: 
	*	@type: private
	*/
	changeCellType:function(r, ind, type){
		type=type||this.cellType[ind];
		var z = this.cells3(r, ind);
		var v = z.getValue();
		z.cell._cellType=type;
		var z = this.cells3(r, ind);
		z.setValue(v);
	},
	/**
	*   @desc: set excell type for all cells in specified row
	*   @param: rowId - row ID
	*   @param: type - type of excell
	*   @edition: Professional
	*   @type:  public
	*/
	setRowExcellType:function(rowId, type){
		var z = this.rowsAr[rowId];
		
		for (var i = 0; i < z.childNodes.length; i++)this.changeCellType(z, i, type);
	},
	/**
	*   @desc: set excell type for all cells in specified column
	*   @param: colIndex - column index
	*   @param: type - type of excell
	*   @edition: Professional
	*   @type:  public
	*/
	setColumnExcellType:function(colIndex, type){
		for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i] && this.rowsBuffer[i].tagName=="TR")
			this.changeCellType(this.rowsBuffer[i], colIndex, type);
		if (this.cellType[colIndex]=="math")
			this._strangeParams[i]=type;
		else
			this.cellType[colIndex]=type;
	},
	
	//#}
	//#}
	
	/**
	*   @desc: execute code for each row in a grid
	*   @param: custom_code - function which get row id as incomming argument
	*   @type:  public
	*/
	forEachRow:function(custom_code){
		for (var a in this.rowsAr)
			if (this.rowsAr[a]&&this.rowsAr[a].idd)
			custom_code.apply(this, [this.rowsAr[a].idd]);
	},
	forEachRowA:function(custom_code){
		for (var a =0; a<this.rowsBuffer.length; a++){
			if (this.rowsBuffer[a])
				custom_code.call(this, this.render_row(a).idd);
		}
	},
	/**
	*   @desc: execute code for each cell in a row
	*   @param: rowId - id of row where cell must be itterated
	*   @param: custom_code - function which get eXcell object as incomming argument
	*   @type:  public
	*/
	forEachCell:function(rowId, custom_code){
		var z = this.getRowById(rowId);
		
		if (!z)
			return;
		
		for (var i = 0; i < this._cCount; i++) custom_code(this.cells3(z, i),i);
	},
	/**
	*   @desc: changes grid's container size on the fly to fit total width of grid columns
	*   @param: mode  - truse/false - enable / disable
	*   @param: max_limit  - max allowed width, not limited by default
	*   @param: min_limit  - min allowed width, not limited by default
	*   @type:  public
	*/
	enableAutoWidth:function(mode, max_limit, min_limit){
		this._awdth=[
			dhx4.s2b(mode),
			parseInt(max_limit||99999),
			parseInt(min_limit||0)
		];
		if (arguments.length == 1)
			this.objBox.style.overflowX=mode?"hidden":"auto";
	},
	//#update_from_xml:06042008{	
	/**
	*   @desc: refresh grid from XML ( doesnt work for buffering, tree grid or rows in smart rendering mode )
	*   @param: insert_new - insert new items
	*   @param: del_missed - delete missed rows
	*   @param: afterCall - function, will be executed after refresh completted
	*   @type:  public
	*/
	
	updateFromXML:function(url, insert_new, del_missed, afterCall){
		if (typeof insert_new == "undefined")
			insert_new=true;
		this._refresh_mode=[
			true,
			insert_new,
			del_missed
		];
		this.load(url,afterCall)
	},
	_refreshFromXML:function(xml){
		if (this._f_rowsBuffer) this.filterBy(0,"");
		reset = false;
		if (window.eXcell_tree){
			eXcell_tree.prototype.setValueX=eXcell_tree.prototype.setValue;
			eXcell_tree.prototype.setValue=function(content){
				var r=this.grid._h2.get[this.cell.parentNode.idd]
				if (r && this.cell.parentNode.valTag){
					this.setLabel(content);
				} else
				this.setValueX(content);
			};
		}
		
		var tree = this.cellType._dhx_find("tree");
		var top = dhx4.ajax.xmltop("rows", xml);
		var pid = top.getAttribute("parent")||0;
		
		var del = {
		};
		
		if (this._refresh_mode[2]){
			if (tree != -1)
			this._h2.forEachChild(pid, function(obj){
					del[obj.id]=true;
			}, this);
			else
			this.forEachRow(function(id){
					del[id]=true;
			});
		}
		
		var rows = dhx4.ajax.xpath("//row", top);
		
		for (var i = 0; i < rows.length; i++){
			var row = rows[i];
			var id = row.getAttribute("id");
			del[id]=false;
			var pid = row.parentNode.getAttribute("id")||pid;
			if (this.rowsAr[id] && this.rowsAr[id].tagName!="TR"){
				if (this._h2)
					this._h2.get[id].buff.data=row;
				else
					this.rowsBuffer[this.getRowIndex(id)].data=row;
				this.rowsAr[id]=row;
			} else if (this.rowsAr[id]){
				this._process_xml_row(this.rowsAr[id], row, -1);
				this._postRowProcessing(this.rowsAr[id],true)
				if (this._fake && this._fake.rowsAr[id])
					this._fake._process_xml_row(this._fake.rowsAr[id], row, -1);
			} else if (this._refresh_mode[1]){
				var dadd={
					idd: id,
					data: row,
					_parser: this._process_xml_row,
					_locator: this._get_xml_data
				};
				
				var render_index = this.rowsBuffer.length;
				if (this._refresh_mode[1]=="top"){
					this.rowsBuffer.unshift(dadd);
					render_index = 0;
				} else
				this.rowsBuffer.push(dadd);
				
				if (this._h2){ 
					reset=true;
					(this._h2.add(id,(row.parentNode.getAttribute("id")||row.parentNode.getAttribute("parent")))).buff=this.rowsBuffer[this.rowsBuffer.length-1];
				} else if (this._srnd)
				reset = true;
				
				this.rowsAr[id]=row;
				row=this.render_row(render_index);
				this._insertRowAt(row,render_index?-1:0)
			}
		}
		
		if (this._refresh_mode[2])
		for (id in del){
			if (del[id]&&this.rowsAr[id])
				this.deleteRow(id);
		}
		
		this._refresh_mode=null;
		if (window.eXcell_tree)
			eXcell_tree.prototype.setValue=eXcell_tree.prototype.setValueX;
		
		if (reset){
			if (this._h2) 
				this._renderSort();
			else
				this.render_dataset();
		}
		
		if (this._f_rowsBuffer) {
			this._f_rowsBuffer = null;
			this.filterByAll();
		}
	},
	//#}	
	//#co_excell:06042008{
	/**
	*   @desc: get combobox specific for cell in question
	*   @param: id - row id
	*   @param: ind  - column index
	*   @type:  public
	*/
	getCustomCombo:function(id, ind){
		var cell = this.cells(id, ind).cell;
		
		if (!cell._combo)
			cell._combo=new dhtmlXGridComboObject();
		return cell._combo;
	},
	//#}
	/**
	*   @desc: set tab order of columns
	*   @param: order - list of tab indexes (default delimiter is ",")
	*   @type:  public
	*/
	setTabOrder:function(order){
		var t = order.split(this.delim);
		this._tabOrder=[];
		var max=this._cCount||order.length;
		
		for (var i = 0; i < max; i++)t[i]={
			c: parseInt(t[i]),
			ind: i
		};
		t.sort(function(a, b){
				return (a.c > b.c ? 1 : -1);
		});
		
		for (var i = 0; i < max; i++)
			if (!t[i+1]||( typeof t[i].c == "undefined"))
			this._tabOrder[t[i].ind]=(t[0].ind+1)*-1;
		else
			this._tabOrder[t[i].ind]=t[i+1].ind;
	},
	
	i18n:{
		loading: "Loading",
		decimal_separator:".",
		group_separator:","
	},
	
	//key_ctrl_shift
	_key_events:{
		k13_1_0: function(){
			var rowInd = this.rowsCol._dhx_find(this.row)
			this.selectCell(this.rowsCol[rowInd+1], this.cell._cellIndex, true);
		},
		k13_0_1: function(){
			var rowInd = this.rowsCol._dhx_find(this.row)
			this.selectCell(this.rowsCol[rowInd-1], this.cell._cellIndex, true);
		},
		k13_0_0: function(){
			this.editStop();
			this.callEvent("onEnter", [
					(this.row ? this.row.idd : null),
					(this.cell ? this.cell._cellIndex : null)
			]);
			this._still_active=true;
		},
		k9_0_0: function(){
			this.editStop();
			if (!this.callEvent("onTab",[true])) return true;
			var z = this._getNextCell(null, 1);
			
			if (z){
				this.selectCell(z.parentNode, z._cellIndex, (this.row != z.parentNode), false, true);
				this._still_active=true;
			}
		},
		k9_0_1: function(){
			this.editStop();
			if (!this.callEvent("onTab",[false])) return false;
			var z = this._getNextCell(null, -1);
			
			if (z){
				this.selectCell(z.parentNode, z._cellIndex, (this.row != z.parentNode), false, true);
				this._still_active=true;
			}
		},
		k113_0_0: function(){
			if (this._f2kE)
				this.editCell();
		},
		k32_0_0: function(){
			var c = this.cells4(this.cell);
			
			if (!c.changeState||(c.changeState() === false))
				return false;
		},
		k27_0_0: function(){
			this.editStop(true);
		},
		k33_0_0: function(){
			if (this.pagingOn)
				this.changePage(this.currentPage-1);
			else
				this.scrollPage(-1);
		},
		k34_0_0: function(){
			if (this.pagingOn)
				this.changePage(this.currentPage+1);
			else
				this.scrollPage(1);
		},
		k37_0_0: function(){
			if (!this.editor&&this.isTreeGrid())
				this.collapseKids(this.row)
			else
				return false;
		},
		k39_0_0: function(){
			if (!this.editor&&this.isTreeGrid())
				this.expandKids(this.row)
			else
				return false;
		},
		k40_0_0: function(){
			var master = this._realfake?this._fake:this;
			if (this.editor&&this.editor.combo)
				this.editor.shiftNext();
			else {
				if (!this.row.idd) return;
				var rowInd = Math.max((master._r_select||0),this.getRowIndex(this.row.idd));
				var row = this._nextRow(rowInd, 1);
				if (row){
					master._r_select=null;
					this.selectCell(row, this.cell._cellIndex, true);
					if (master.pagingOn) master.showRow(row.idd);
				} else {
					if (!this.callEvent("onLastRow", [])) return false;
					this._key_events.k34_0_0.apply(this, []);
					if (this.pagingOn && this.rowsCol[rowInd+1])
						this.selectCell(rowInd+1, 0, true);
				}
			}
			this._still_active=true;
		},
		k38_0_0: function(){
			var master = this._realfake?this._fake:this;
			if (this.editor&&this.editor.combo)
				this.editor.shiftPrev();
			else {
				if (!this.row.idd) return;
				var rowInd = this.getRowIndex(this.row.idd)+1;
				if (rowInd != -1 && (!this.pagingOn || (rowInd!=1))){
					var nrow = this._nextRow(rowInd-1, -1);
					this.selectCell(nrow, this.cell._cellIndex, true);
					if (master.pagingOn && nrow) master.showRow(nrow.idd);
				} else {
					this._key_events.k33_0_0.apply(this, []);
					/*
					if (this.pagingOn && this.rowsCol[this.rowsBufferOutSize-1])
					this.selectCell(this.rowsBufferOutSize-1, 0, true);
					*/
				}
			}
			this._still_active=true;
		}
	},
	
	//(c)dhtmlx ltd. www.dhtmlx.com
	
	_build_master_row:function(){
		var t = document.createElement("DIV");
		var html = ["<table><tr>"];
		
		for (var i = 0; i < this._cCount; i++)html.push("<td></td>");
		html.push("</tr></table>");
		t.innerHTML=html.join("");
		this._master_row=t.firstChild.rows[0];
	},
	
	_prepareRow:function(new_id){ /*TODO: hidden columns */
		if (!this._master_row)
			this._build_master_row();
		
		var r = this._master_row.cloneNode(true);
		
		for (var i = 0; i < r.childNodes.length; i++){
			r.childNodes[i]._cellIndex=i;
			if (this._enbCid) r.childNodes[i].id="c_"+new_id+"_"+i;
			if (this.dragAndDropOff)
				this.dragger.addDraggableItem(r.childNodes[i], this);
		}
		r.idd=new_id;
		r.grid=this;
		
		return r;
	},
	
	//#non_xml_data:06042008{
	_process_jsarray_row:function(r, data){
		r._attrs={
		};
		
		for (var j = 0; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
		};
		
		this._fillRow(r, (this._c_order ? this._swapColumns(data) : data));
		return r;
	},
	_get_jsarray_data:function(data, ind){
		return data[ind];
	},
	_process_json_row:function(r, data){
		data = this._c_order ? this._swapColumns(data.data) : data.data;
		return this._process_some_row(r, data);
	},
	_process_some_row:function(r,data){
		r._attrs={};
		
		for (var j = 0; j < r.childNodes.length; j++)
			r.childNodes[j]._attrs={};
		
		this._fillRow(r, data);
		return r;
	},
	_get_json_data:function(data, ind){
		return data.data[ind];
	},
	
	
	_process_js_row:function(r, data){
		var arr = [];
		for (var i=0; i<this.columnIds.length; i++){
			arr[i] = data[this.columnIds[i]];
			if (!arr[i] && arr[i]!==0)
				arr[i]="";
		}
		this._process_some_row(r,arr);
		
		r._attrs = data;
		return r;
	},
	_get_js_data:function(data, ind){
		return data[this.columnIds[ind]];
	},
	_process_csv_row:function(r, data){
		r._attrs={
		};
		
		for (var j = 0; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
		};
		
		this._fillRow(r, (this._c_order ? this._swapColumns(data.split(this.csv.cell)) : data.split(this.csv.cell)));
		return r;
	},
	_get_csv_data:function(data, ind){
		return data.split(this.csv.cell)[ind];
	},
	//#}
	_process_store_row:function(row, data){
		var result = [];
		for (var i = 0; i < this.columnIds.length; i++)
			result[i] = data[this.columnIds[i]];
		for (var j = 0; j < row.childNodes.length; j++)
			row.childNodes[j]._attrs={};
		
		row._attrs = data;
		this._fillRow(row, result);
	},	
	//#xml_data:06042008{
	_process_xml_row:function(r, xml){		
		var cellsCol = dhx4.ajax.xpath(this.xml.cell, xml);
		var strAr = [];
		
		r._attrs=this._xml_attrs(xml);
		
		//load userdata
		if (this._ud_enabled){
			var udCol = dhx4.ajax.xpath("./userdata", xml);
			
			for (var i = udCol.length-1; i >= 0; i--){
				var u_record = "";
				for (var j=0; j < udCol[i].childNodes.length; j++)
					u_record += udCol[i].childNodes[j].nodeValue;
				
				this.setUserData(r.idd,udCol[i].getAttribute("name"), u_record);
			}
		}
		
		//load cell data
		for (var j = 0; j < cellsCol.length; j++){
			var cellVal = cellsCol[this._c_order?this._c_order[j]:j];
			if (!cellVal) continue;
			var cind = r._childIndexes?r._childIndexes[j]:j;
			var exc = cellVal.getAttribute("type");
			
			if (r.childNodes[cind]){
				if (exc)
					r.childNodes[cind]._cellType=exc;
				r.childNodes[cind]._attrs=this._xml_attrs(cellVal);
			}
			
			if (!cellVal.getAttribute("xmlcontent")){
				if (cellVal.firstChild)
					cellVal=cellVal.firstChild.wholeText||cellVal.firstChild.data;
				else
					cellVal="";
			}
			
			strAr.push(cellVal);
		}
		
		for (j < cellsCol.length; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
		};
		
		//treegrid
		if (r.parentNode&&r.parentNode.tagName == "row")
			r._attrs["parent"]=r.parentNode.getAttribute("idd");
		
		//back to common code
		this._fillRow(r, strAr);
		return r;
	},
	_get_xml_data:function(data, ind){ 
		data=data.firstChild;
		
		while (true){
			if (!data)
				return "";
			
			if (data.tagName == "cell")
				ind--;
			
			if (ind < 0)
				break;
			data=data.nextSibling;
		}
		return (data.firstChild ? data.firstChild.data : "");
	},
	//#}	
	_fillRow:function(r, text){
		if (this.editor && this.editor.parentNode && this.editor.parentNode.idd == r.idd)
			this.editStop();
		
		for (var i = 0; i < r.childNodes.length; i++){
			if ((i < text.length)||(this.defVal[i])){
				
				var ii=r.childNodes[i]._cellIndex;
				var val = text[ii];
				var aeditor = this.cells4(r.childNodes[i]);
				
				if ((this.defVal[ii])&&((val == "")||( typeof (val) == "undefined")))
					val=this.defVal[ii];
				
				if (aeditor) aeditor.setValue(val)
			} else {
				r.childNodes[i].innerHTML="&nbsp;";
				r.childNodes[i]._clearCell=true;
			}
		}
		
		return r;
	},
	
	_postRowProcessing:function(r,donly){ 
		if (r._attrs["class"])
			r._css=r.className=r._attrs["class"];
		
		if (r._attrs.locked)
			r._locked=true;
		
		if (r._attrs.bgColor)
			r.bgColor=r._attrs.bgColor;
		var cor=0;	
		
		for (var i = 0; i < r.childNodes.length; i++){
			var c=r.childNodes[i];
			var ii=c._cellIndex;
			//style attribute
			var s = c._attrs.style||r._attrs.style;
			
			if (s)
				c.style.cssText+=";"+s;
			
			if (c._attrs["class"])
				c.className=c._attrs["class"];
			s=c._attrs.align||this.cellAlign[ii];
			
			/*ORIGINAL
			if (s)
				c.align=s;
			c.vAlign=c._attrs.valign||this.cellVAlign[ii];
			*/
			
			/*HSITX*/
			if(s){
				c.className	= c.className + " align_" + s;
			}
			/**/
			
			var color = c._attrs.bgColor||this.columnColor[ii];
			
			
			if (color)
				c.bgColor=color;
			
			if (c._attrs["colspan"] && !donly){ 
				this.setColspan(r.idd, i+cor, c._attrs["colspan"]);
				//i+=(c._attrs["colspan"]-1);
				cor+=(c._attrs["colspan"]-1);
			}
			
			if (this._hrrar&&this._hrrar[ii]&&!donly){
				c.style.display="none";
			}
		};
		this.callEvent("onRowCreated", [
				r.idd,
				r,
				null
		]);
	},
	/**
	*   @desc: load data from external file ( xml, json, jsarray, csv )
	*   @param: url - url to external file
	*   @param: call - after loading callback function, optional, can be ommited
	*   @param: type - type of data (xml,csv,json,jsarray) , optional, xml by default
	*   @type:  public
	*/			
	load:function(url, call, type){
		this.callEvent("onXLS", [this]);
		if (arguments.length == 2 && typeof call != "function"){
			type=call;
			call=null;
		}
		this._last_load_type = type = type||this._last_load_type||"xml";
		
		if (!this.xmlFileUrl)
			this.xmlFileUrl=url;
		this._data_type=type;
		
		this.xmlLoader = this.doLoadDetails;
		
		var that = this;
		this.xmlLoader = function(xml){
			if (!that.callEvent) return;
			that["_process_"+type](xml.xmlDoc);
			if (!that._contextCallTimer)
				that.callEvent("onXLE", [that,0,0,xml.xmlDoc,type]);
			
			if (call){
				call();
				call=null;
			}
		};		
		return dhx4.ajax.get(url, this.xmlLoader);
	},
	//#__pro_feature:21092006{		
	loadXMLString:function(str, afterCall){
		if (window.console && window.console.info)
		  window.console.info("loadXMLString was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44");

		this.parse( { responseXML: dhx4.ajax.parse(str) }, afterCall, "xml")
	},
	//#}
	loadXML:function(url, afterCall){
		if (window.console && window.console.info)
			window.console.info("loadXML was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44");

		this.load(url, afterCall, "xml")
	},
	/**
	*   @desc: load data from local datasource ( xml string, csv string, xml island, xml object, json objecs , javascript array )
	*   @param: data - string or object
	*   @param: type - data type (xml,json,jsarray,csv), optional, data threated as xml by default
	*   @type:  public
	*/			
	parse:function(data, call, type){
		if (arguments.length == 2 && typeof call != "function"){
			type=call;
			call=null;
		}
		this._last_load_type = type = type||this._last_load_type||"xml";
		this._data_type=type;
		
		if (type == "xml" && typeof data == "string")
			data = { responseXML: dhx4.ajax.parse(data) };
		
		this["_process_"+type](data);
		if (!this._contextCallTimer)
			this.callEvent("onXLE", [this,0,0,data,type]);
		if (call)
			call();
	},
	
	xml:{
		top: "rows",
		row: "./row",
		cell: "./cell",
		s_row: "row",
		s_cell: "cell",
		row_attrs: [],
		cell_attrs: []
	},
	
	csv:{
		row: "\n",
		cell: ","
	},
	
	_xml_attrs:function(node){
		var data = {
		};
		
		if (node.attributes.length){
			for (var i = 0; i < node.attributes.length; i++)data[node.attributes[i].name]=node.attributes[i].value;
		}
		
		return data;
	},
	//#xml_data:06042008{	
	_process_xml:function(xhr){
		if (this._refresh_mode) return this._refreshFromXML(xhr);
		this._parsing=true;
		var top = dhx4.ajax.xmltop(this.xml.top, xhr);
		if (top.tagName!=this.xml.top) return;
		var skey = top.getAttribute("dhx_security");
		if (skey)
			dhtmlx.security_key = skey;
		
		//#config_from_xml:20092006{
		this._parseHead(top);
		//#}
		var rows = dhx4.ajax.xpath(this.xml.row, top)
		var cr = parseInt(top.getAttribute("pos")||0);
		var total = parseInt(top.getAttribute("total_count")||0);
		if (!this.pagingOn)
			var total = Math.min(total, 32000000/this._srdh);
		
		var reset = false;
		if (total && total!=this.rowsBuffer.length){
			if (!this.rowsBuffer[total-1]){
				if (this.rowsBuffer.length)
					reset=true;
				this.rowsBuffer[total-1]=null;
			} 
			if (total<this.rowsBuffer.length){
				this.rowsBuffer.splice(total, this.rowsBuffer.length - total);
				reset = true;
			}
		}
		
		
		if (this.isTreeGrid())
			return this._process_tree_xml(top);
		
		
		for (var i = 0; i < rows.length; i++){
			if (this.rowsBuffer[i+cr])
				continue;
			var id = rows[i].getAttribute("id")||(i+cr+1);
			this.rowsBuffer[i+cr]={
				idd: id,
				data: rows[i],
				_parser: this._process_xml_row,
				_locator: this._get_xml_data
			};
			
			this.rowsAr[id]=rows[i];
			//this.callEvent("onRowCreated",[r.idd]);
		}
		
		this.callEvent("onDataReady", []);
		if (reset && this._srnd){
			var h = this.objBox.scrollTop;
			this._reset_view();
			this.objBox.scrollTop = h;
		} else {
			this.render_dataset();
		}
		
		this._parsing=false;
	},
	//#}
	//#non_xml_data:06042008{	
	_process_jsarray:function(data){
		this._parsing=true;
		data = data.responseText || data;
		if (typeof data == "string"){
			eval("dhtmlx.temp="+data+";");
			data = dhtmlx.temp;
		}
		
		for (var i = 0; i < data.length; i++){
			var id = i+1;
			this.rowsBuffer.push({
					idd: id,
					data: data[i],
					_parser: this._process_jsarray_row,
					_locator: this._get_jsarray_data
			});
			
			this.rowsAr[id]=data[i];
			//this.callEvent("onRowCreated",[r.idd]);
		}
		this.render_dataset();
		this._parsing=false;
	},
	
	_process_csv:function(data){
		this._parsing=true;
		data=data.responseText || data;
		data=data.replace(/\r/g,"");
		data=data.split(this.csv.row);
		if (this._csvHdr){
			this.clearAll();
			var thead=data.splice(0,1)[0].split(this.csv.cell);
			if (!this._csvAID) thead.splice(0,1);
			this.setHeader(thead.join(this.delim));
			this.init();
		}
		
		for (var i = 0; i < data.length; i++){
			if (!data[i] && i==data.length-1) continue; //skip new line at end of text
			if (this._csvAID){
				var id = i+1;
				this.rowsBuffer.push({
						idd: id,
						data: data[i],
						_parser: this._process_csv_row,
						_locator: this._get_csv_data
				});
			} else {
				var temp = data[i].split(this.csv.cell);
				var id = temp.splice(0,1)[0];
				this.rowsBuffer.push({
						idd: id,
						data: temp,
						_parser: this._process_jsarray_row,
						_locator: this._get_jsarray_data
				});
			}
			
			
			this.rowsAr[id]=data[i];
			//this.callEvent("onRowCreated",[r.idd]);
		}
		this.render_dataset();
		this._parsing=false;
	},
	
	_process_js:function(data){
		return this._process_json(data, "js");
	},
	
	_process_json:function(data, mode){
		this._parsing=true;
		
		var data = data.responseText || data;
		if (typeof data == "string"){
			eval("dhtmlx.temp="+data+";");
			data = dhtmlx.temp;
		}
		
		if (mode == "js"){
			if (data.data)
				data = data.data;
			for (var i = 0; i < data.length; i++){
				var row = data[i];
				var id  = row.id||(i+1);
				this.rowsBuffer.push({
						idd: id,
						data: row,
						_parser: this._process_js_row,
						_locator: this._get_js_data
				});
				
				this.rowsAr[id]=data[i];
			}
		} else {
			if (data.rows){
				for (var i = 0; i < data.rows.length; i++){
					var id = data.rows[i].id;
					this.rowsBuffer.push({
							idd: id,
							data: data.rows[i],
							_parser: this._process_json_row,
							_locator: this._get_json_data
					});
					
					this.rowsAr[id]=data.rows[i];
				}
			}
		}
		if (data.dhx_security)
			dhtmlx.security_key = data.dhx_security;
		
		this.callEvent("onDataReady", []);
		this.render_dataset();
		this._parsing=false;
	},
	//#}	
	render_dataset:function(min, max){ 
		//normal mode - render all
		//var p=this.obj.parentNode;
		//p.removeChild(this.obj,true)
		if (this._srnd){
			if (this._fillers)
				return this._update_srnd_view();
			
			max=Math.min((this._get_view_size()+(this._srnd_pr||0)), this.rowsBuffer.length);
			
		}
		
		if (this.pagingOn){
			min=Math.max((min||0),(this.currentPage-1)*this.rowsBufferOutSize);
			max=Math.min(this.currentPage*this.rowsBufferOutSize, this.rowsBuffer.length)
		} else {
			min=min||0;
			max=max||this.rowsBuffer.length;
		}
		
		for (var i = min; i < max; i++){
			var r = this.render_row(i)
			
			if (r == -1){
				if (this.xmlFileUrl){
					if (this.callEvent("onDynXLS",[i,(this._dpref?this._dpref:(max-i))]))
						this.load(this.xmlFileUrl+dhtmlx.url(this.xmlFileUrl)+"posStart="+i+"&count="+(this._dpref?this._dpref:(max-i)), this._data_type);
				}
				max=i;
				break;
			}
			
			if (!r.parentNode||!r.parentNode.tagName){ 
				this._insertRowAt(r, i);
				if (r._attrs["selected"] || r._attrs["select"]){
					this.selectRow(r,r._attrs["call"]?true:false,true);
					r._attrs["selected"]=r._attrs["select"]=null;
				}
			}
			
			
			if (this._ads_count && i-min==this._ads_count){
				var that=this;
				this._context_parsing=this._context_parsing||this._parsing;
				return this._contextCallTimer=window.setTimeout(function(){
						that._contextCallTimer=null;
						that.render_dataset(i,max);
						if (!that._contextCallTimer){
							if(that._context_parsing)
								that.callEvent("onXLE",[])
							else 
								that._fixAlterCss();
							that._context_parsing=false;
						}
				},this._ads_time)
			}
		}
		if (this._ads_count && i == max)
			this.callEvent("onDistributedEnd",[]);
		
		if (this._srnd&&!this._fillers){
			var add_count = this.rowsBuffer.length-max;
			this._fillers = [];
			if (this._fake && !this._realfake) this._fake._fillers = [];
			
			var block_size = Math.round(990000/this._srdh);
			while (add_count > 0){
				var add_step = (_isIE || window._FFrv)?Math.min(add_count, block_size):add_count;
				var new_filler = this._add_filler(max, add_step);
				if (new_filler)
					this._fillers.push(new_filler);
				add_count -= add_step;
				max += add_step;
			}				
		}
		
		//p.appendChild(this.obj)
		this.setSizes();
	},
	
	render_row:function(ind){
		if (!this.rowsBuffer[ind])
			return -1;
		
		if (this.rowsBuffer[ind]._parser){
			var r = this.rowsBuffer[ind];
			if (this.rowsAr[r.idd] && this.rowsAr[r.idd].tagName=="TR")
				return this.rowsBuffer[ind]=this.rowsAr[r.idd];
			var row = this._prepareRow(r.idd);
			this.rowsBuffer[ind]=row;
			this.rowsAr[r.idd]=row;
			r._parser.call(this, row, r.data);
			this._postRowProcessing(row);
			return row;
		}
		return this.rowsBuffer[ind];
	},
	
	
	_get_cell_value:function(row, ind, method){
		if (row._locator){
			/*if (!this._data_cache[row.idd])
			this._data_cache[row.idd]=[];
			if (this._data_cache[row.idd][ind]) 
			return this._data_cache[row.idd][ind];
			else
			return this._data_cache[row.idd][ind]=row._locator.call(this,row.data,ind);
			*/
			if (this._c_order)
				ind=this._c_order[ind];
			return row._locator.call(this, row.data, ind);
		}
		return this.cells3(row, ind)[method ? method : "getValue"]();
	},
	//#sorting:06042008{	
	/**
	*   @desc: sort grid
	*   @param: col - index of column, by which grid need to be sorted
	*   @param: type - sorting type (str,int,date), optional, by default sorting type taken from column setting
	*   @param: order - sorting order (asc,des), optional, by default sorting order based on previous sorting operation
	*   @type:  public
	*/		
	sortRows:function(col, type, order){
		this.editStop();
		//default values
		order=(order||"asc").toLowerCase();
		type=(type||this.fldSort[col]);
		col=col||0;
		
		if (this.isTreeGrid())
			this.sortTreeRows(col, type, order);
		else{
			
			var arrTS = {
			};
			
			var atype = this.cellType[col];
			var amet = "getValue";
			
			if (atype == "link")
				amet="getContent";
			
			if (atype == "dhxCalendar"||atype == "dhxCalendarA")
				amet="getDate";
				
			if (atype == "co"||atype == "coro")
				amet="getText";
				
			for (var i = 0;
				i < this.rowsBuffer.length;
				i++)arrTS[this.rowsBuffer[i].idd]=this._get_cell_value(this.rowsBuffer[i], col, amet);
				
				this._sortRows(col, type, order, arrTS);
		}
		this.callEvent("onAfterSorting", [col,type,order]);
	},
	/**
	*	@desc: 
	*	@type: private
	*/
	_sortCore:function(col, type, order, arrTS, s){
		var sort = "sort";
		
		if (this._sst){
			s["stablesort"]=this.rowsCol.stablesort;
			sort="stablesort";
		}
		//#__pro_feature:21092006{	
		//#custom_sort:21092006{
		if (type.length > 4)
			type=window[type];
		
		if (type == 'cus'){
			var cstr=this._customSorts[col];
			s[sort](function(a, b){
					return cstr(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);
			});
		}
		else if (typeof (type) == 'function'){
			s[sort](function(a, b){
					return type(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);
			});
		}
		else
			//#}
		//#}
		if (type == 'str'){
			s[sort](function(a, b){
					if (order == "asc")
						return arrTS[a.idd] > arrTS[b.idd] ? 1 : (arrTS[a.idd] < arrTS[b.idd] ? -1 : 0);
					else
						return arrTS[a.idd] < arrTS[b.idd] ? 1 : (arrTS[a.idd] > arrTS[b.idd] ? -1 : 0);
			});
		}
		else if (type == 'int'){
			s[sort](function(a, b){
					var aVal = parseFloat(arrTS[a.idd]);
					aVal=isNaN(aVal) ? -99999999999999 : aVal;
					var bVal = parseFloat(arrTS[b.idd]);
					bVal=isNaN(bVal) ? -99999999999999 : bVal;
					
					if (order == "asc")
						return aVal-bVal;
					else
						return bVal-aVal;
			});
		}
		else if (type == 'date'){
			s[sort](function(a, b){
					var aVal = Date.parse(arrTS[a.idd])||(Date.parse("01/01/1900"));
					var bVal = Date.parse(arrTS[b.idd])||(Date.parse("01/01/1900"));
					
					if (order == "asc")
						return aVal-bVal
					else
						return bVal-aVal
			});
		}
	},
	/**
	*   @desc: inner sorting routine
	*   @type: private
	*   @topic: 7
	*/
	_sortRows:function(col, type, order, arrTS){
		this._sortCore(col, type, order, arrTS, this.rowsBuffer);
		this._reset_view();
		this.callEvent("onGridReconstructed", []);
	},
	//#}		
	_reset_view:function(skip){
		if (!this.obj.rows[0]) return;
		if (this._lahRw) this._unsetRowHover(0, true); //remove hovering during reset
		this.callEvent("onResetView",[]);
		var tb = this.obj.rows[0].parentNode;
		var tr = tb.removeChild(tb.childNodes[0], true)
		if (_isKHTML) //Safari 2x
			for (var i = tb.parentNode.childNodes.length-1; i >= 0; i--) { if (tb.parentNode.childNodes[i].tagName=="TR") tb.parentNode.removeChild(tb.parentNode.childNodes[i],true); }
		else if (_isIE)
			for (var i = tb.childNodes.length-1; i >= 0; i--) tb.childNodes[i].removeNode(true);
		else
			tb.innerHTML="";
		tb.appendChild(tr)
		this.rowsCol=dhtmlxArray();
		if (this._sst)
			this.enableStableSorting(true);
		this._fillers=this.undefined;
		if (!skip){
			if (_isIE && this._srnd){
				// var p=this._get_view_size;
				// this._get_view_size=function(){ return 1; }
				this.render_dataset();
				// this._get_view_size=p;
			}
			else
				this.render_dataset();
		}
		
		
	},
	
	/**
	*   @desc: delete row from the grid
	*   @param: row_id - row ID
	*   @type:  public
	*/		
	deleteRow:function(row_id, node){
		if (!node)
			node=this.getRowById(row_id)
		
		if (!node)
			return;
		
		this.editStop();
		if (!this._realfake)
			if (this.callEvent("onBeforeRowDeleted", [row_id]) == false)
			return false;
		
		var pid=0;
		if (this.cellType._dhx_find("tree") != -1 && !this._realfake){
			pid=this._h2.get[row_id].parent.id;
			this._removeTrGrRow(node);
		}
		else {
			if (node.parentNode)
				node.parentNode.removeChild(node);
			
			var ind = this.rowsCol._dhx_find(node);
			
			if (ind != -1)
				this.rowsCol._dhx_removeAt(ind);
			
			for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i]&&this.rowsBuffer[i].idd == row_id){
				this.rowsBuffer._dhx_removeAt(i);
				ind=i;
				break;
			}
		}
		this.rowsAr[row_id]=null;
		
		for (var i = 0; i < this.selectedRows.length; i++)
			if (this.selectedRows[i].idd == row_id)
			this.selectedRows._dhx_removeAt(i);
		
		if (this._srnd){
			/*HSITX*/
			/*
			for (var i = 0; i < this._fillers.length; i++){
				var f = this._fillers[i]
				if (!f) continue; //can be null	
				if (f[0] >= ind)
					this._update_fillers(i, 0, -1);
				else if (f[0]+f[1] > ind)
					this._update_fillers(i, -1, 0);
			};
			*/
			/**/
			
			this._update_srnd_view();
		}
		
		if (this.pagingOn)
			this.changePage();
		if (!this._realfake)  this.callEvent("onAfterRowDeleted", [row_id,pid]);
		this.callEvent("onGridReconstructed", []);
		if (this._ahgr) this.setSizes();
		return true;
	},
	
	_addRow:function(new_id, text, ind){
		if (ind == -1|| typeof ind == "undefined")
			ind=this.rowsBuffer.length;
		if (typeof text == "string") text=text.split(this.delim);
		var row = this._prepareRow(new_id);
		row._attrs={
		};
		
		for (var j = 0; j < row.childNodes.length; j++)row.childNodes[j]._attrs={
		};
		
		
		this.rowsAr[row.idd]=row;
		if (this._h2) this._h2.get[row.idd].buff=row;	//treegrid specific
		this._fillRow(row, text);
		this._postRowProcessing(row);
		if (this._skipInsert){
			this._skipInsert=false;
			return this.rowsAr[row.idd]=row;
		}
		
		if (this.pagingOn){
			this.rowsBuffer._dhx_insertAt(ind,row);
			this.rowsAr[row.idd]=row;
			
			/*return row;*/
			/*HSITX*/
			return this._insertRowAt(row, ind)
			/**/
		}
		
		/*HSITX*/
		/*
		if (this._fillers){ 
			this.rowsCol._dhx_insertAt(ind, null);
			this.rowsBuffer._dhx_insertAt(ind,row);
			if (this._fake) this._fake.rowsCol._dhx_insertAt(ind, null);
			this.rowsAr[row.idd]=row;
			var found = false;
			
			for (var i = 0; i < this._fillers.length; i++){
				var f = this._fillers[i];
				
				if (f&&f[0] <= ind&&(f[0]+f[1]) >= ind){
					f[1]=f[1]+1;
					var nh = f[2].firstChild.style.height=parseInt(f[2].firstChild.style.height)+this._srdh+"px";
					found=true;
					if (this._fake){
						this._fake._fillers[i][1]++;
						this._fake._fillers[i][2].firstChild.style.height = nh;
					}
				}
				
				if (f&&f[0] > ind){
					f[0]=f[0]+1
					if (this._fake) this._fake._fillers[i][0]++;
				}
			}
			
			if (!found)
			this._fillers.push(this._add_filler(ind, 1, (ind == 0 ? {
					parentNode: this.obj.rows[0].parentNode,
					nextSibling: (this.rowsCol[1])
			} : this.rowsCol[ind-1])));
			
			return row;
		}
		*/
		/**/
		
		this.rowsCol._dhx_insertAt(ind, null);
		this.rowsBuffer._dhx_insertAt(ind,row);
		if(this._fake){this._fake.rowsCol._dhx_insertAt(ind, null);}
		return this._insertRowAt(row, ind);
	},
	
	/**
	*   @desc: add row to the grid
	*   @param: new_id - row ID, must be unique
	*   @param: text - row values, may be a comma separated list or an array
	*   @param: ind - index of new row, optional, row added to the last position by default
	*   @type:  public
	*/	
	addRow:function(new_id, text, ind){
		var r = this._addRow(new_id, text, ind);
		
		if (!this.dragContext)
			this.callEvent("onRowAdded", [new_id]);
		
		if (this.pagingOn)
			this.changePage(this.currentPage)
		
		if (this._srnd)
			/*HSITX*/
			/*this._update_srnd_view();*/
			/**/
		
		r._added=true;
		
		if (this._srnd && !this._fillers)
			this._fillers = [];
		
		if (this._ahgr)
			/*HSITX*/
			/*this.setSizes();*/
			/**/
		this.callEvent("onGridReconstructed", []);
		return r;
	},
	
	_insertRowAt:function(r, ind, skip){
		this.rowsAr[r.idd]=r;
		
		if (this._skipInsert){
			this._skipInsert=false;
			return r;
		}
		
		if ((ind < 0)||((!ind)&&(parseInt(ind) !== 0)))
			ind=this.rowsCol.length;
		else {
			if (ind > this.rowsCol.length)
				ind=this.rowsCol.length;
		}
		
		if (this._cssEven){
			var css = r.className.replace(this._cssUnEven, "");
			if ((this._cssSP ? this.getLevel(r.idd) : ind)%2 == 1)
				r.className=css+" "+this._cssUnEven+(this._cssSU ? (" "+this._cssUnEven+"_"+this.getLevel(r.idd)) : "");
			else
				r.className=css+" "+this._cssEven+(this._cssSU ? (" "+this._cssEven+"_"+this.getLevel(r.idd)) : "");
		}
		/*
		if (r._skipInsert) {                
		this.rowsAr[r.idd] = r;
		return r;
		}*/
		if (!skip)
			if ((ind == (this.obj.rows.length-1))||(!this.rowsCol[ind]))
			if (_isKHTML)
			this.obj.appendChild(r);
		else {
			this.obj.firstChild.appendChild(r);
		}
		else {
			this.rowsCol[ind].parentNode.insertBefore(r, this.rowsCol[ind]);
		}
		
		this.rowsCol._dhx_insertAt(ind, r);
		this.callEvent("onRowInserted",[r, ind]);
		return r;
	},
	
	getRowById:function(id){
		var row = this.rowsAr[id];
		
		if (row){
			if (row.tagName != "TR"){
				for (var i = 0; i < this.rowsBuffer.length; i++)
					if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id)
					return this.render_row(i);
				if (this._h2) return this.render_row(null,row.idd);
			}
			return row;
		}
		return null;
	},
	
	/**
	*   @desc: gets dhtmlXGridCellObject object (if no arguments then gets dhtmlXGridCellObject object of currently selected cell)
	*   @param: row_id -  row id
	*   @param: col -  column index
	*   @returns: dhtmlXGridCellObject object (see its methods below)
	*   @type: public
	*   @topic: 4
	*/
	cellById:function(row_id, col){
		return this.cells(row_id, col);
	},
	/**
	*   @desc: gets dhtmlXGridCellObject object (if no arguments then gets dhtmlXGridCellObject object of currently selected cell)
	*   @param: row_id -  row id
	*   @param: col -  column index
	*   @returns: dhtmlXGridCellObject object (use it to get/set value to cell etc.)
	*   @type: public
	*   @topic: 4
	*/
	cells:function(row_id, col){
		if (arguments.length == 0)
			return this.cells4(this.cell);
		else
			var c = this.getRowById(row_id);
		var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]] : c.childNodes[col]);
		if (!cell && c._childIndexes)
			cell = c.firstChild || {};
		return this.cells4(cell);
	},
	/**
	*   @desc: gets dhtmlXGridCellObject object
	*   @param: row_index -  row index
	*   @param: col -  column index
	*   @returns: dhtmlXGridCellObject object (see its methods below)
	*   @type: public
	*   @topic: 4
	*/
	cellByIndex:function(row_index, col){
		return this.cells2(row_index, col);
	},
	/**
	*   @desc: gets dhtmlXGridCellObject object
	*   @param: row_index -  row index
	*   @param: col -  column index
	*   @returns: dhtmlXGridCellObject object (see its methods below)
	*   @type: public
	*   @topic: 4
	*/
	cells2:function(row_index, col){
		var c = this.render_row(row_index);
		var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]] : c.childNodes[col]);
		if (!cell && c._childIndexes)
			cell = c.firstChild || {};
		return this.cells4(cell);
	},
	/**
	*   @desc: gets exCell editor for row  object and column id
	*   @type: private
	*   @topic: 4
	*/
	cells3:function(row, col){
		var cell = (row._childIndexes ? row.childNodes[row._childIndexes[col]] : row.childNodes[col]);
		return this.cells4(cell);
	},
	/**
	*   @desc: gets exCell editor for cell  object
	*   @type: private
	*   @topic: 4
	*/
	cells4:function(cell){
		var type = window["eXcell_"+(cell._cellType||this.cellType[cell._cellIndex])];
		
		if (type)
			return new type(cell);
	},	
	cells5:function(cell, type){ 
		var type = type||(cell._cellType||this.cellType[cell._cellIndex]);
		
		if (!this._ecache[type]){
			if (!window["eXcell_"+type])
				var tex = eXcell_ro;
			else
				var tex = window["eXcell_"+type];
			
			this._ecache[type]=new tex(cell);
		}
		this._ecache[type].cell=cell;
		return this._ecache[type];
	},
	dma:function(mode){
		if (!this._ecache)
		this._ecache={
		};
		
		if (mode&&!this._dma){
			this._dma=this.cells4;
			this.cells4=this.cells5;
		} else if (!mode&&this._dma){
			this.cells4=this._dma;
			this._dma=null;
		}
	},
	
	/**
	*   @desc: returns count of row in grid ( in case of dynamic mode it will return expected count of rows )
	*   @type:  public
	*	@returns: count of rows in grid
	*/	
	getRowsNum:function(){
		return this.rowsBuffer.length;
	},
	
	
	/**
	*   @desc: enables/disables mode when readonly cell is not available with tab 
	*   @param: mode - (boolean) true/false
	*   @type:  public
	*/
	enableEditTabOnly:function(mode){
		if (arguments.length > 0)
			this.smartTabOrder=dhx4.s2b(mode);
		else
			this.smartTabOrder=true;
	},
	/**
	*   @desc: sets elements which get focus when tab is pressed in the last or first (tab+shift) cell 
	*   @param: start - html object or its id - gets focus when tab+shift are pressed in the first cell  
	*   @param: end - html object or its id - gets focus when tab is pressed in the last cell  
	*   @type:  public
	*/
	setExternalTabOrder:function(start, end){
		var grid = this;
		this.tabStart=( typeof (start) == "object") ? start : document.getElementById(start);
		
		var oldkeydown_start = this.tabStart.onkeydown;
		this.tabStart.onkeydown=function(e){
			if (oldkeydown_start)
				oldkeydown_start.call(this, e);
			
			var ev = (e||window.event);
			if (ev.keyCode == 9 && !ev.shiftKey){
				
				ev.cancelBubble=true;		
				grid.selectCell(0, 0, 0, 0, 1);
				
				if (grid.smartTabOrder && grid.cells2(0, 0).isDisabled()){
					grid._key_events["k9_0_0"].call(grid);
				}
				this.blur();
				return false;
			}
		};
		if(_isOpera) this.tabStart.onkeypress = this.tabStart.onkeydown;
		this.tabEnd=( typeof (end) == "object") ? end : document.getElementById(end);
		
		var oldkeydown_end= this.tabEnd.onkeydown;
		this.tabEnd.onkeydown=this.tabEnd.onkeypress=function(e){
			if (oldkeydown_end)
				oldkeydown_end.call(this, e);
			
			var ev = (e||window.event);
			if (ev.keyCode == 9 && ev.shiftKey){
				ev.cancelBubble=true;
				grid.selectCell((grid.getRowsNum()-1), (grid.getColumnCount()-1), 0, 0, 1);
				
				if (grid.smartTabOrder && grid.cells2((grid.getRowsNum()-1), (grid.getColumnCount()-1)).isDisabled()){
					grid._key_events["k9_0_1"].call(grid);
				}
				this.blur();
				return false;
			}
		};
		if(_isOpera) this.tabEnd.onkeypress = this.tabEnd.onkeydown;
	},
	/**
	*   @desc: returns unique ID
	*   @type:  public
	*/	
	uid:function(){
		if (!this._ui_seed) this._ui_seed=(new Date()).valueOf();
		return this._ui_seed++;
	},
	setIconset:function(name){
		this.iconset = name;
	},
	/**
	*   @desc: clears existing grid state and load new XML
	*   @type:  public
	*/
	clearAndLoad:function(){
		if (this._last_load_request){
			//abort last loading if new issued
			var last = this._last_load_request.xmlDoc;
			if (last.readyState != 4){
				try{
					last.onreadystatechange = function(){};
					last.abort();
				} catch(e){}
			}
		};

		var t=this._pgn_skin; this._pgn_skin=null;
		this.clearAll();
		this._pgn_skin=t;
		this._last_load_request = this.load.apply(this,arguments);
	},
	/**
	*   @desc: returns details about current grid state
	*   @type:  public
	*/
	getStateOfView:function(){
		if (this.pagingOn){
			var start = (this.currentPage-1)*this.rowsBufferOutSize;
			return [this.currentPage, start, Math.min(start+this.rowsBufferOutSize,this.rowsBuffer.length), this.rowsBuffer.length ];
		}

		var min=Math.floor(this.objBox.scrollTop/this._srdh);
		var max=Math.ceil(parseInt(this.objBox.offsetHeight)/this._srdh);

		if (this.multiLine){
			var pxHeight = this.objBox.scrollTop;
			min = 0;
			while(pxHeight >= 0) {
				pxHeight-=this.rowsCol[min]?this.rowsCol[min].offsetHeight:this._srdh;
				min++;
			}
			min--;

			pxHeight += this.objBox.offsetHeight;
			max = 0;
			while (pxHeight >=0 ){
				pxHeight-=this.rowsCol[min+max]?this.rowsCol[min+max].offsetHeight:this._srdh;
				max++;
			}
		}

		return [
			min,
			max,
			this.rowsBuffer.length
		];
	}
};

//grid
(function(){
		//local helpers
		function direct_set(name,value){ this[name]=value; 	}
		function direct_call(name,value){ this[name].call(this,value); 	}
		function joined_call(name,value){ this[name].call(this,value.join(this.delim));  }
		function set_options(name,value){
			for (var i=0; i < value.length; i++) 
			if (typeof value[i] == "object"){
				var combo = this.getCombo(i);
				for (var key in value[i])
					combo.put(key, value[i][key]);
			}
		}
		function header_set(name,value,obj){
			//make a matrix
			var rows = 1;
			var header = [];
			function add(i,j,value){
				if (!header[j]) header[j]=[];
				if (typeof value == "object") value.toString=function(){ return this.text; }
				header[j][i]=value;
			}
			
			for (var i=0; i<value.length; i++) {
				if (typeof(value[i])=="object" && value[i].length){
					for (var j=0; j < value[i].length; j++)
						add(i,j,value[i][j]);		
				} else
				add(i,0,value[i]);		
			}
			for (var i=0; i<header.length; i++)
			for (var j=0; j<header[0].length; j++){
				var h=header[i][j];
				header[i][j]=(h||"").toString()||"&nbsp;";
				if (h&&h.colspan)
					for (var k=1; k < h.colspan; k++) add(j+k,i,"#cspan");
				if (h&&h.rowspan)
					for (var k=1; k < h.rowspan; k++) add(j,i+k,"#rspan");
			}
			
			this.setHeader(header[0]);
			for (var i=1; i < header.length; i++) 
				this.attachHeader(header[i]);
		}
		
		//defenitions
		var columns_map=[
			{name:"label", 	def:"&nbsp;", 	operation:"setHeader",		type:header_set		},
			{name:"id", 	def:"", 		operation:"columnIds",		type:direct_set		},
			{name:"width", 	def:"*", 		operation:"setInitWidths", 	type:joined_call	},
			{name:"align", 	def:"left", 	operation:"cellAlign",		type:direct_set		},
			{name:"valign", def:"middle", 	operation:"cellVAlign",		type:direct_set		},
			{name:"sort", 	def:"na", 		operation:"fldSort",		type:direct_set		},
			{name:"type", 	def:"ro", 		operation:"setColTypes",	type:joined_call	},
			{name:"options",def:"", 		operation:"",				type:set_options	}
		];
		
		//extending	
		dhtmlx.extend_api("dhtmlXGridObject",{
				_init:function(obj){
					return [obj.parent];
				},
				image_path:"setImagePath",
				columns:"columns",
				rows:"rows",
				headers:"headers",
				skin:"setSkin",
				smart_rendering:"enableSmartRendering",
				css:"enableAlterCss",
				auto_height:"enableAutoHeight",
				save_hidden:"enableAutoHiddenColumnsSaving",
				save_cookie:"enableAutoSaving",
				save_size:"enableAutoSizeSaving",
				auto_width:"enableAutoWidth",
				block_selection:"enableBlockSelection",
				csv_id:"enableCSVAutoID",
				csv_header:"enableCSVHeader",
				cell_ids:"enableCellIds",
				colspan:"enableColSpan",
				column_move:"enableColumnMove",
				context_menu:"enableContextMenu",
				distributed:"enableDistributedParsing",
				drag:"enableDragAndDrop",
				drag_order:"enableDragOrder",
				tabulation:"enableEditTabOnly",
				header_images:"enableHeaderImages",
				header_menu:"enableHeaderMenu",
				keymap:"enableKeyboardSupport",
				mouse_navigation:"enableLightMouseNavigation",
				markers:"enableMarkedCells",
				math_editing:"enableMathEditing",
				math_serialization:"enableMathSerialization",
				drag_copy:"enableMercyDrag",
				multiline:"enableMultiline",
				multiselect:"enableMultiselect",
				save_column_order:"enableOrderSaving",
				hover:"enableRowsHover",
				rowspan:"enableRowspan",
				smart:"enableSmartRendering",
				save_sorting:"enableSortingSaving",
				stable_sorting:"enableStableSorting",
				undo:"enableUndoRedo",
				csv_cell:"setCSVDelimiter",
				date_format:"setDateFormat",
				drag_behavior:"setDragBehavior",
				editable:"setEditable",
				without_header:"setNoHeader",
				submit_changed:"submitOnlyChanged",
				submit_serialization:"submitSerialization",
				submit_selected:"submitOnlySelected",
				submit_id:"submitOnlyRowID",		
				xml:"load"
		},{
			columns:function(obj){
				for (var j=0; j<columns_map.length; j++){
					var settings = [];
					for (var i=0; i<obj.length; i++)
						settings[i]=obj[i][columns_map[j].name]||columns_map[j].def;
					var type=columns_map[j].type||direct_call;
					type.call(this,columns_map[j].operation,settings,obj);
				}
				this.init();
			},
			rows:function(obj){
				
			},
			headers:function(obj){
				for (var i=0; i < obj.length; i++) 
					this.attachHeader(obj[i]);
			}
		});
		
})();


dhtmlXGridObject.prototype._dp_init=function(dp){
	dp.attachEvent("insertCallback", function(upd, id) {
			if (this.obj._h2)
				this.obj.addRow(id, row, null, parent);
			else
				this.obj.addRow(id, [], 0);
			
			var row = this.obj.getRowById(id);
			if (row){
				this.obj._process_xml_row(row, upd.firstChild);
				this.obj._postRowProcessing(row);	
			}
	});
	dp.attachEvent("updateCallback", function(upd, id) {
			var row = this.obj.getRowById(id);
			if (row){
				this.obj._process_xml_row(row, upd.firstChild);
				this.obj._postRowProcessing(row);	
			}
	});
	dp.attachEvent("deleteCallback", function(upd, id) {
			this.obj.setUserData(id, this.action_param, "true_deleted");
			this.obj.deleteRow(id);
	});
	
	
	dp._methods=["setRowTextStyle","setCellTextStyle","changeRowId","deleteRow"];
	this.attachEvent("onEditCell",function(state,id,index){
			if (dp._columns && !dp._columns[index]) return true;
			var cell = this.cells(id,index)
			if (state==1){
				if(cell.isCheckbox()){
					dp.setUpdated(id,true)
				}
			} else if (state==2){
				if(cell.wasChanged()){
					dp.setUpdated(id,true)
				}
			}
			return true;
	});
	this.attachEvent("onRowPaste",function(id){
			dp.setUpdated(id,true)
	});
	this.attachEvent("onUndo",function(id){
			dp.setUpdated(id,true)
	});
	this.attachEvent("onRowIdChange",function(id,newid){
			var ind=dp.findRow(id);
			if (ind<dp.updatedRows.length)
				dp.updatedRows[ind]=newid;
	});
	this.attachEvent("onSelectStateChanged",function(rowId){
			if(dp.updateMode=="row")
				dp.sendData();
			return true;
	});
	this.attachEvent("onEnter",function(rowId,celInd){
			if(dp.updateMode=="row")
				dp.sendData();
			return true;
	});
	this.attachEvent("onBeforeRowDeleted",function(rowId){
			if (dp._silent_mode || (!this.rowsAr[rowId])) return true;
			if (this.dragContext && dp.dnd) {
				window.setTimeout(function(){
						dp.setUpdated(rowId,true);
				},1);
				return true;
			}
			var z=dp.getState(rowId);
			if (this._h2){
				this._h2.forEachChild(rowId,function(el){
						dp.setUpdated(el.id,false);
						dp.markRow(el.id,true,"deleted");
				},this);
			}
			if (z=="inserted") {  dp.set_invalid(rowId,false); dp.setUpdated(rowId,false);		return true; }
			if (z=="deleted")  return false;
			if (z=="true_deleted")  { dp.setUpdated(rowId,false); return true; }
			
			dp.setUpdated(rowId,true,"deleted");
			return false;
	});
	this.attachEvent("onBindUpdate", function(data, key, id){
		dp.setUpdated(id, true);
	});
	this.attachEvent("onRowAdded",function(rowId){
			if (this.dragContext && dp.dnd) return true;
			dp.setUpdated(rowId,true,"inserted")
			return true;
	});
	dp._getRowData=function(rowId,pref){
		var data = {};
		
		data["gr_id"]=rowId;
		if (this.obj.isTreeGrid())
			data["gr_pid"]=this.obj.getParentId(rowId);
		
		var r=this.obj.getRowById(rowId);
		for (var i=0; i<this.obj._cCount; i++){
			if (this.obj._c_order)
				var i_c=this.obj._c_order[i];
			else
				var i_c=i;
			
			var c=this.obj.cells(r.idd,i);
			if (this._changed && !c.wasChanged()) continue;
			if (this._endnm)
				data[this.obj.getColumnId(i)]=c.getValue();
			else
				data["c"+i_c]=c.getValue();
		}
		
		var udata=this.obj.UserData[rowId];
		if (udata){
			for (var j=0; j<udata.keys.length; j++)
				if (udata.keys[j] && udata.keys[j].indexOf("__")!=0)
				data[udata.keys[j]]=udata.values[j];
		}
		var udata=this.obj.UserData["gridglobaluserdata"];
		if (udata){
			for (var j=0; j<udata.keys.length; j++)
				data[udata.keys[j]]=udata.values[j];
		}
		return data;
	};
	dp._clearUpdateFlag=function(rowId){
		var row=this.obj.getRowById(rowId);
		if (row)
			for (var j=0; j<this.obj._cCount; j++)
			this.obj.cells(rowId,j).cell.wasChanged=false;	//using cells because of split
	};
	dp.checkBeforeUpdate=function(rowId){ 
		var valid=true; var c_invalid=[];
		for (var i=0; i<this.obj._cCount; i++)
		if (this.mandatoryFields[i]){
			var res=this.mandatoryFields[i].call(this.obj,this.obj.cells(rowId,i).getValue(),rowId,i);
			if (typeof res == "string"){
				this.messages.push(res);
				valid = false;
			} else {
				valid&=res;
				c_invalid[i]=!res;
			}
		}
		if (!valid){
			this.set_invalid(rowId,"invalid",c_invalid);
			this.setUpdated(rowId,false);
		}
		return valid;
	};	
};


dhx4.attachEvent("onGridCreated", function(grid){
		//make separate config array for each grid
		grid._con_f_used = [].concat(grid._con_f_used);
		dhtmlXGridObject.prototype._con_f_used=[];
		
		if (grid._was_created_once) return;
		grid._was_created_once = true;

		var clear_url=function(url){
			url=url.replace(/(\?|\&)connector[^\f]*/g,"");
			return url+(url.indexOf("?")!=-1?"&":"?")+"connector=true"+(this.hdr.rows.length > 0 ? "&dhx_no_header=1":"");
		};
		var combine_urls=function(url){
			return clear_url.call(this,url)+(this._connector_sorting||"")+(this._connector_filter||"");
		};
		var sorting_url=function(url,ind,dir){
			this._connector_sorting="&dhx_sort["+ind+"]="+dir;
			return combine_urls.call(this,url);
		};
		var filtering_url=function(url,inds,vals){
			var chunks = [];
			for (var i=0; i<inds.length; i++)
				chunks[i]="dhx_filter["+inds[i]+"]="+encodeURIComponent(vals[i]);
			this._connector_filter="&"+chunks.join("&");
			return combine_urls.call(this,url);
		};
		grid.attachEvent("onCollectValues",function(ind){
				if (this._con_f_used[ind]){
					if (typeof(this._con_f_used[ind]) == "object")
						return this._con_f_used[ind];
					else
						return false;
				}
				return true;
		});	
		grid.attachEvent("onDynXLS",function(){
				if (this.xmlFileUrl)
					this.xmlFileUrl=combine_urls.call(this,this.xmlFileUrl);
				return true;
		});				
		grid.attachEvent("onBeforeSorting",function(ind,type,dir){
				if (type=="connector"){
					var self=this;
					this.clearAndLoad(sorting_url.call(this,this.xmlFileUrl,ind,dir),function(){
							self.setSortImgState(true,ind,dir);
					});
					return false;
				}
				return true;
		});
		grid.attachEvent("onFilterStart",function(a,b){
				if (this._con_f_used.length){
					var ss = this.getSortingState();
					var self=this;
					this.clearAndLoad(filtering_url.call(this,this.xmlFileUrl,a,b));
					if (ss.length)
						self.setSortImgState(true,ss[0],ss[1]);
					return false;
				}
				return true;
		});
});

dhtmlXGridObject.prototype._con_f_used=[];
dhtmlXGridObject.prototype._in_header_connector_text_filter=function(t,i){
	if (!this._con_f_used[i])
		this._con_f_used[i]=1;
	return this._in_header_text_filter(t,i);
};
dhtmlXGridObject.prototype._in_header_connector_select_filter=function(t,i){
	if (!this._con_f_used[i])
		this._con_f_used[i]=2;
	return this._in_header_select_filter(t,i);
};

if (!dhtmlXGridObject.prototype.load_connector){
	
	dhtmlXGridObject.prototype.load_connector=dhtmlXGridObject.prototype.load;
	dhtmlXGridObject.prototype.load=function(url, call, type){
		if (!this._colls_loaded && this.cellType){
			var ar=[];
			for (var i=0; i < this.cellType.length; i++)
				if (this.cellType[i].indexOf("co")==0 || this.cellType[i].indexOf("clist")==0 || this._con_f_used[i]==2) ar.push(i);
			if (ar.length)
				arguments[0]+=(arguments[0].indexOf("?")!=-1?"&":"?")+"connector=true&dhx_colls="+ar.join(",");
		}
		return this.load_connector.apply(this,arguments);
	};
	dhtmlXGridObject.prototype._parseHead_connector=dhtmlXGridObject.prototype._parseHead;
	dhtmlXGridObject.prototype._parseHead=function(url, call, type){
		this._parseHead_connector.apply(this,arguments);
		if (!this._colls_loaded){
			var cols = dhx4.ajax.xpath("./coll_options", arguments[0]);
			for (var i=0; i < cols.length; i++){
				var f = cols[i].getAttribute("for");
				var v = [];
				var combo=null;
				if (this.cellType[f] == "combo")
					combo = this.getColumnCombo(f);
				else if (this.cellType[f].indexOf("co")==0)
					combo=this.getCombo(f);
				
				var os = dhx4.ajax.xpath("./item",cols[i]);
				var opts = [];
				for (var j=0; j<os.length; j++){
					var val=os[j].getAttribute("value");
					
					if (combo){
						var lab=os[j].getAttribute("label")||val;
						
						if (combo.addOption)
							opts.push([val, lab]);
						else
							combo.put(val,lab);
						
						v[v.length]=lab;
					} else
					v[v.length]=val;
				}
				if (opts.length){
					if (combo)
						combo.addOption(opts);
				} else if (v.length && !combo)
				if (this.registerCList)
					this.registerCList(f*1, v);
				
				
				if (this._con_f_used[f*1])
					this._con_f_used[f*1]=v;
			}
			this._colls_loaded=true;
		}
	};
	
}	

dhtmlXGridObject.prototype.getRowData = function( /*string*/ rowId) {
	var result = {};
	var colsNum = this.getColumnsNum();
	for (var index = 0; index < colsNum; index++) {
		var colId = this.getColumnId(index);
		if (colId) {
			result[colId] = this.cells(rowId, index).getValue();
		}
	}
	return result;
};

dhtmlXGridObject.prototype.setRowData = function( /*string*/ rowId, /*json*/ rowJson) {
	var colsNum = this.getColumnsNum();
	for (var index = 0; index < colsNum; index++) {
		var colId = this.getColumnId(index);
		if (colId && rowJson.hasOwnProperty(colId)) {
			this.cells(rowId, index).setValue(rowJson[colId]);
		}
	}
};

//(c)dhtmlx ltd. www.dhtmlx.com

/**
*	@desc: dhtmlxGrid cell object constructor (shouldn't be accesed directly. Use cells and cells2 methods of the grid instead)
*	@type: cell
*	@returns: dhtmlxGrid cell
*/
function dhtmlXGridCellObject(obj){
	/**
	*	@desc: desctructor, clean used memory
	*	@type: public
	*/
	this.destructor=function(){
		this.cell.obj=null;
		this.cell=null;
		this.grid=null;
		this.base=null;
		return null;
	}
	this.cell=obj;
	/**
	*	@desc: gets Value of cell
	*	@type: public
	*/
	this.getValue=function(){
		if ((this.cell.textContent)&&(this.cell.textContent.tagName == "TEXTAREA"))
			return this.cell.textContent.value;
		else
			return this.cell.innerHTML._dhx_trim(); //innerText;
	}

	/**
	*	@desc: gets math formula of cell if any
	*	@type: public
	*/
	this.getMathValue=function(){
		if (this.cell.original)
			return this.cell.original; //innerText;
		else
			return this.getValue();
	}
	
//#excell_methods:04062008{
	/**
	*	@desc: determ. font style if it was set
	*	@returns: font name only if it was set for the cell
	*	@type: public
	*/
	this.getFont=function(){
		arOut=new Array(3);

		if (this.cell.style.fontFamily)
			arOut[0]=this.cell.style.fontFamily

		if (this.cell.style.fontWeight == 'bold'||this.cell.parentNode.style.fontWeight == 'bold')
			arOut[1]='bold';

		if (this.cell.style.fontStyle == 'italic'||this.cell.parentNode.style.fontWeight == 'italic')
			arOut[1]+='italic';

		if (this.cell.style.fontSize)
			arOut[2]=this.cell.style.fontSize
		else
			arOut[2]="";
		return arOut.join("-")
	}
	/**
	*	@desc: determ. cell's text color
	*	@returns: cell's text color
	*	@type: public
	*/
	this.getTextColor=function(){
		if (this.cell.style.color)
			return this.cell.style.color
		else
			return "#000000";
	}
	/**
	*	@desc: determ. cell's background color
	*	@returns: cell's background color
	*	@type: public
	*/
	this.getBgColor=function(){
		return this.cell.style.backgroundColor || "#FFFFFF";
	}
	/**
	*	@desc: determines horisontal align od the cell
	*	@returns: horisontal align of cell content
	*	@type: public
	*/
	this.getHorAlign=function(){
		if (this.cell.style.textAlign)
			return this.cell.style.textAlign;

		else if (this.cell.style.textAlign)
			return this.cell.style.textAlign;

		else
			return "left";
	}
	/**
	*	@desc: gets width of the cell in pixel
	*	@returns: width of the cell in pixels
	*	@type: public
	*/
	this.getWidth=function(){
		return this.cell.scrollWidth;
	}

	/**
	*	@desc: sets font family to the cell
	*	@param: val - string in format: Arial-bold(italic,bolditalic,underline)-12px
	*	@type: public
	*/
	this.setFont=function(val){
		fntAr=val.split("-");
		this.cell.style.fontFamily=fntAr[0];
		this.cell.style.fontSize=fntAr[fntAr.length-1]

		if (fntAr.length == 3){
			if (/bold/.test(fntAr[1]))
				this.cell.style.fontWeight="bold";

			if (/italic/.test(fntAr[1]))
				this.cell.style.fontStyle="italic";

			if (/underline/.test(fntAr[1]))
				this.cell.style.textDecoration="underline";
		}
	}
	/**
	*	@desc: sets text color to the cell
	*	@param: val - color value (name or hex)
	*	@type: public
	*/
	this.setTextColor=function(val){
		this.cell.style.color=val;
	}
	/**
	*	@desc: sets background color to the cell
	*	@param: val - color value (name or hex)
	*	@type: public
	*/
	this.setBgColor=function(val){
		if (val == "")
			val=null;
		this.cell.style.background=val;
	}
	/**
	*	@desc: sets horisontal align to the cell
	*	@param: val - value in single-letter or full format(exmp: r or right)
	*	@type: public
	*/
	this.setHorAlign=function(val){
		if (val.length == 1){
			if (val == 'c')
				this.cell.style.textAlign='center'

			else if (val == 'l')
				this.cell.style.textAlign='left';

			else
				this.cell.style.textAlign='right';
		} else
			this.cell.style.textAlign=val
	}
//#}
	/**
	*	@desc: determines whether cell value was changed
	*	@returns: true if cell value was changed, otherwise - false
	*	@type: public
	*/
	this.wasChanged=function(){
		if (this.cell.wasChanged)
			return true;
		else
			return false;
	}
	/**
	*	@desc: determines whether first child of the cell is checkbox or radio
	*	@returns: true if first child of the cell is input element of type radio or checkbox
	*	@type: deprecated
	*/
	this.isCheckbox=function(){
		var ch = this.cell.firstChild;

		if (ch&&ch.tagName == 'INPUT'){
			type=ch.type;

			if (type == 'radio'||type == 'checkbox')
				return true;
			else
				return false;
		} else
			return false;
	}
	/**
	*	@desc: determines whether radio or checkbox inside is checked
	*	@returns: true if first child of the cell is checked
	*	@type: public
	*/
	this.isChecked=function(){
		if (this.isCheckbox()){
			return this.cell.firstChild.checked;
		}
	}
	/**
	*	@desc: determines whether cell content (radio,checkbox) is disabled
	*	@returns: true if first child of the cell is disabled
	*	@type: public
	*/
	this.isDisabled=function(){
		return this.cell._disabled;
	}
	/**
	*	@desc: checks checkbox or radion
	*	@param: fl - true or false
	*	@type: public
	*/
	this.setChecked=function(fl){
		if (this.isCheckbox()){
			if (fl != 'true'&&fl != 1)
				fl=false;
			this.cell.firstChild.checked=fl;
		}
	}
	/**
	*	@desc: disables radio or checkbox
	*	@param: fl - true or false
	*	@type: public
	*/
	this.setDisabled=function(fl){
		if (fl != 'true'&&fl != 1)
			fl=false;

		if (this.isCheckbox()){
			this.cell.firstChild.disabled=fl;

			if (this.disabledF)
				this.disabledF(fl);
		}
		this.cell._disabled=fl;
	}
}

dhtmlXGridCellObject.prototype={
	getAttribute: function(name){
		return this.cell._attrs[name];
	},
	setAttribute: function(name, value){
		this.cell._attrs[name]=value;
	},
	getInput:function(){
		if (this.obj && (this.obj.tagName=="INPUT" || this.obj.tagName=="TEXTAREA")) return this.obj;
		
		var inps=(this.obj||this.cell).getElementsByTagName("TEXTAREA");
		if (!inps.length)
			inps=(this.obj||this.cell).getElementsByTagName("INPUT");
		return inps[0];
	}
}

/**
*	@desc: sets value to the cell
*	@param: val - new value
*	@type: public
*/
dhtmlXGridCellObject.prototype.setValue=function(val){
	if (( typeof (val) != "number")&&(!val||val.toString()._dhx_trim() == "")){
		val="&nbsp;"
		this.cell._clearCell=true;
	} else
		this.cell._clearCell=false;
	this.setCValue(val);
}
/**
*	@desc: sets value to the cell
*	@param: val - new value
*	@param: val2
*	@type: private
*/
dhtmlXGridCellObject.prototype.getTitle=function(){
	return (_isIE ? this.cell.innerText : this.cell.textContent);
}

dhtmlXGridCellObject.prototype.setCValue=function(val, val2){
	this.cell.innerHTML=val;
//#__pro_feature:21092006{
//#on_cell_changed:23102006{
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		(arguments.length > 1 ? val2 : val)
	]);
//#}
//#}
}

dhtmlXGridCellObject.prototype.setCTxtValue=function(val){
	this.cell.innerHTML="";
	this.cell.appendChild(document.createTextNode(val));
//#__pro_feature:21092006{	
//#on_cell_changed:23102006{
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		val
	]);
//#}
//#}
}

/**
*	@desc: sets text representation of cell which contains math formula ( setLabel doesn't triger math calculations as setValue do)
*	@param: val - new value
*	@type: public
*/
dhtmlXGridCellObject.prototype.setLabel=function(val){
	this.cell.innerHTML=val;
}

/**
*	@desc: get formula of ExCell ( actual only for math based exCells )
*	@type: public
*/
dhtmlXGridCellObject.prototype.getMath=function(){
	if (this._val)
		return this.val;
	else
		return this.getValue();
}

/**
*	@desc: dhtmlxGrid cell editor constructor (base for all eXcells). Shouldn't be accessed directly
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell(){
	this.obj=null; //editor
	//this.cell = null//cell to get value from
	this.val=null; //current value (before edit)
	/**
	*	@desc: occures on space for example 
	*	@type: private
	*/
	this.changeState=function(){
		return false
	}
	/**
	*	@desc: opens editor
	*	@type: private
	*/
	this.edit=function(){
		this.val=this.getValue()
	} //
	/**
	*	@desc: return value to cell, closes editor
	*	@returns: if cell's value was changed (true) or not
	*	@type: private
	*/
	this.detach=function(){
		return false
	} //
	/**
	*	@desc: gets position (left-right) of element
	*	@param: oNode - element to get position of
	*	@type: private
	*	@topic: 8
	*/
	this.getPosition=function(oNode){
		var oCurrentNode = oNode;
		var iLeft = 0;
		var iTop = 0;

		while (oCurrentNode.tagName != "BODY"){
			iLeft+=oCurrentNode.offsetLeft;
			iTop+=oCurrentNode.offsetTop;
			oCurrentNode=oCurrentNode.offsetParent;
		}
		return new Array(iLeft, iTop);
	}
}
eXcell.prototype=new dhtmlXGridCellObject;


/**
*	@desc: simple text editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ed(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
		this.cell.atag=(!this.grid.multiLine) ? "INPUT" : "TEXTAREA";
		this.val=this.getValue();
		this.obj=document.createElement(this.cell.atag);
		this.obj.setAttribute("autocomplete", "off");
		this.obj.style.height=(this.cell.offsetHeight-(this.grid.multiLine ? 9 : 4))+"px";
		
		this.obj.className="dhx_combo_edit";
		this.obj.wrap="soft";
		this.obj.style.textAlign=this.cell.style.textAlign;
		this.obj.onclick=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.onmousedown=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.value=this.val
		this.cell.innerHTML="";
		this.cell.appendChild(this.obj);

		this.obj.onselectstart=function(e){
			if (!e)
				e=event;
			e.cancelBubble=true;
			return true;
		};
		if (_isIE){
			this.obj.focus();
			this.obj.blur();
		}
		this.obj.focus();
	}
	this.getValue=function(){
		if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName == this.cell.atag)))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		return this.cell.innerHTML.toString()._dhx_trim();
	}

	this.detach=function(){
		this.setValue(this.obj.value);
		return this.val != this.getValue();
	}
}
eXcell_ed.prototype=new eXcell;

/**
*	@desc: pure text editor ( HTML not supported )
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_edtxt(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.getValue=function(){
		if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName == this.cell.atag)))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		return (_isIE ? this.cell.innerText : this.cell.textContent);
	}
	this.setValue=function(val){
		if (!val||val.toString()._dhx_trim() == ""){
			val=" ";
			this.cell._clearCell=true;
		} else
			this.cell._clearCell=false;
		this.setCTxtValue(val);
	}
}
eXcell_edtxt.prototype=new eXcell_ed;
//#__pro_feature:21092006{
/**
*	@desc: simple numeric text editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*	@edition: professional
*/
function eXcell_edn(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.getValue=function(){
		//this.grid.editStop();
		if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		return this.cell._orig_value||this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex);
	}

	this.detach=function(){
		var tv = this.obj.value;
		this.setValue(tv);
		return this.val != this.getValue();
	}
}
eXcell_edn.prototype=new eXcell_ed;
eXcell_edn.prototype.setValue=function(val){ 
	if (!val||val.toString()._dhx_trim() == ""){
		this.cell._clearCell=true;
		return this.setCValue("&nbsp;",0);
	} else {
		this.cell._clearCell=false;
		this.cell._orig_value = val;
	}
	this.setCValue(this.grid._aplNF(val, this.cell._cellIndex), val);
}
//#}

//#ch_excell:04062008{
/**
*	@desc: checkbox editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ch(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}

	this.disabledF=function(fl){
		if ((fl == true)||(fl == 1))
			this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0.", "item_chk0_dis.").replace("item_chk1.",
				"item_chk1_dis.");
		else
			this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0_dis.", "item_chk0.").replace("item_chk1_dis.",
				"item_chk1.");
	}

	this.changeState=function(fromClick){
		//nb:
		if (fromClick===true && !this.grid.isActive) {
			if (window.globalActiveDHTMLGridObject != null && window.globalActiveDHTMLGridObject != this.grid && window.globalActiveDHTMLGridObject.isActive) window.globalActiveDHTMLGridObject.setActive(false);
			this.grid.setActive(true);
		}
		if ((!this.grid.isEditable)||(this.cell.parentNode._locked)||(this.isDisabled()))
			return;

		if (this.grid.callEvent("onEditCell", [
			0,
			this.cell.parentNode.idd,
			this.cell._cellIndex
		])){
			this.val=this.getValue()

			if (this.val == "1")
				this.setValue("0")
			else
				this.setValue("1")

			this.cell.wasChanged=true;
			//nb:
			this.grid.callEvent("onEditCell", [
				1,
				this.cell.parentNode.idd,
				this.cell._cellIndex
			]);

			this.grid.callEvent("onCheckbox", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);

			this.grid.callEvent("onCheck", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);
		} else { //preserve editing (not tested thoroughly for this editor)
			this.editor=null;
		}
	}
	this.getValue=function(){
		return this.cell.chstate ? this.cell.chstate.toString() : "0";
	}

	this.isCheckbox=function(){
		return true;
	}
	this.isChecked=function(){
		if (this.getValue() == "1")
			return true;
		else
			return false;
	}

	this.setChecked=function(fl){
		this.setValue(fl.toString())
	}
	this.detach=function(){
		return this.val != this.getValue();
	}
	this.edit=null;
}
eXcell_ch.prototype=new eXcell;
eXcell_ch.prototype.setValue=function(val){
	this.cell.style.verticalAlign="middle"; //nb:to center checkbox in line
	//val can be int
	if (val){
		val=val.toString()._dhx_trim();

		if ((val == "false")||(val == "0"))
			val="";
	}

	if (val){
		val="1";
		this.cell.chstate="1";
	} else {
		val="0";
		this.cell.chstate="0"
	}
	var obj = this;
	this.cell.setAttribute("excell", "ch");
	this.setCValue("<img src='"+this.grid.imgURL+"item_chk"+val
		+".gif' onclick='new eXcell_ch(this.parentNode).changeState(true); (arguments[0]||event).cancelBubble=true; '>",
		this.cell.chstate);
}
//#}
//#ra_excell:04062008{
/**
*	@desc: radio editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ra(cell){
	this.base=eXcell_ch;
	this.base(cell)
	this.grid=cell.parentNode.grid;

	this.disabledF=function(fl){
		if ((fl == true)||(fl == 1))
			this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0.", "radio_chk0_dis.").replace("radio_chk1.",
				"radio_chk1_dis.");
		else
			this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0_dis.", "radio_chk0.").replace("radio_chk1_dis.",
				"radio_chk1.");
	}

	this.changeState=function(mode){
		if (mode===false && this.getValue()==1) return;

		if ((!this.grid.isEditable)||(this.cell.parentNode._locked)||(this.isDisabled()))
			return;

		if (this.grid.callEvent("onEditCell", [
			0,
			this.cell.parentNode.idd,
			this.cell._cellIndex
		]) != false){
			this.val=this.getValue()

			if (this.val == "1")
				this.setValue("0")
			else
				this.setValue("1")
			this.cell.wasChanged=true;
			//nb:
			this.grid.callEvent("onEditCell", [
				1,
				this.cell.parentNode.idd,
				this.cell._cellIndex
			]);

			this.grid.callEvent("onCheckbox", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);

			this.grid.callEvent("onCheck", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);
		} else { //preserve editing (not tested thoroughly for this editor)
			this.editor=null;
		}
	}
	this.edit=null;
}
eXcell_ra.prototype=new eXcell_ch;
eXcell_ra.prototype.setValue=function(val){
	this.cell.style.verticalAlign="middle"; //nb:to center checkbox in line

	if (val){
		val=val.toString()._dhx_trim();

		if ((val == "false")||(val == "0"))
			val="";
	}

	if (val){
		if (!this.grid._RaSeCol)
			this.grid._RaSeCol=[];

		if (this.grid._RaSeCol[this.cell._cellIndex]){
			var id = this.grid._RaSeCol[this.cell._cellIndex];
			if (this.grid.rowsAr[id]){
				var z = this.grid.cells(id, this.cell._cellIndex);
				z.setValue("0")
				if (this.grid.rowsAr[z.cell.parentNode.idd])
				this.grid.callEvent("onEditCell", [
					1,
					z.cell.parentNode.idd,
					z.cell._cellIndex
				]);
			}
		}

		this.grid._RaSeCol[this.cell._cellIndex]=this.cell.parentNode.idd;

		val="1";
		this.cell.chstate="1";
	} else {
		val="0";
		this.cell.chstate="0"
	}
	this.cell.setAttribute("excell", "ra");
	this.setCValue("<img src='"+this.grid.imgURL+"radio_chk"+val+".gif' onclick='new eXcell_ra(this.parentNode).changeState(false);'>",
		this.cell.chstate);
}
//#}
//#txt_excell:04062008{
/**
*	@desc: multilene popup editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_txt(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
		this.val=this.getValue()
		this.obj=document.createElement("TEXTAREA");
		this.obj.className="dhx_textarea";

		this.obj.onclick=function(e){
			(e||event).cancelBubble=true
		}
		var arPos = this.grid.getPosition(this.cell); //,this.grid.objBox

		this.obj.value=this.val;

		this.obj.style.display="";
		this.obj.style.textAlign=this.cell.style.textAlign;

		document.body.appendChild(this.obj); //nb:
		if(_isOpera) this.obj.onkeypress=function(ev){ if (ev.keyCode == 9||ev.keyCode == 27) return false; }
		this.obj.onkeydown=function(e){
			var ev = (e||event);

			if (ev.keyCode == 9||ev.keyCode == 27){
				globalActiveDHTMLGridObject.entBox.focus();
				globalActiveDHTMLGridObject.doKey({
					keyCode: ev.keyCode,
					shiftKey: ev.shiftKey,
					srcElement: "0"
					});

				return false;
			}
		}

		this.obj.style.left=arPos[0]+"px";
		this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";

		if (this.cell.offsetWidth < 200)
			var pw = 200;
		else
			var pw = this.cell.offsetWidth;
		this.obj.style.width=pw+16+"px"

		if (_isIE) { this.obj.select(); this.obj.value=this.obj.value; }//dzen of IE
		this.obj.focus()
	}
	this.detach=function(){
		var a_val = "";

		a_val=this.obj.value;

		if (a_val == ""){
			this.cell._clearCell=true;
		}
		else
			this.cell._clearCell=false;
		this.setValue(a_val);
		document.body.removeChild(this.obj);
		this.obj=null;
		return this.val != this.getValue();
	}
	this.getValue=function(){
		if (this.obj){
			return this.obj.value;
		}
				
		if (this.cell._clearCell)
			return "";

		if (typeof this.cell._brval != "undefined") return this.cell._brval;

		if ((!this.grid.multiLine))
			return this.cell._brval||this.cell.innerHTML;
		else
			return this.cell._brval||this.cell.innerHTML.replace(/<br[^>]*>/gi, "\n")._dhx_trim(); //innerText;
	}
}

eXcell_txt.prototype=new eXcell;

/**
*	@desc: multiline text editor without HTML support
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_txttxt(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.getValue=function(){
		if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		if ((!this.grid.multiLine)&&this.cell._brval)
			return this.cell._brval;

		return (_isIE ? this.cell.innerText : this.cell.textContent);
	}
	this.setValue=function(val){
		this.cell._brval=val;

		if (!val||val.toString()._dhx_trim() == ""){
			val=" ";
			this.cell._clearCell=true;
		} else
			this.cell._clearCell=false;
		this.setCTxtValue(val);
	}
}

eXcell_txttxt.prototype=new eXcell_txt;

eXcell_txt.prototype.setValue=function(val){
	this.cell._brval=val;

	if (!val||val.toString()._dhx_trim() == ""){
		val="&nbsp;"
		this.cell._clearCell=true;
	} else
		this.cell._clearCell=false;

	if ((!this.grid.multiLine) || this.cell._clearCell)
		this.setCValue(val, this.cell._brval);
	else
		this.setCValue(val.replace(/\n/g, "<br/>"), val);
}
//#}
//#co_excell:04062008{
/**
*	@desc: combobox editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_co(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
		this.combo=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex));
		this.editable=true
	}
	this.shiftNext=function(){
		var z = this.list.options[this.list.selectedIndex+1];

		if (z)
			z.selected=true;
		this.obj.value=this.list.options[this.list.selectedIndex].text;

		return true;
	}
	this.shiftPrev=function(){
		if (this.list.selectedIndex != 0){
			var z = this.list.options[this.list.selectedIndex-1];

			if (z)
				z.selected=true;
			this.obj.value=this.list.options[this.list.selectedIndex].text;
		}

		return true;
	}

	this.edit=function(){
		this.val=this.getValue();
		this.text=this.getText()._dhx_trim();
		var arPos = this.grid.getPosition(this.cell) //,this.grid.objBox)

		this.obj=document.createElement("TEXTAREA");
		this.obj.className="dhx_combo_edit";

		this.obj.style.height=(this.cell.offsetHeight-(this.grid.multiLine ? 9 : 4))+"px";

		this.obj.wrap="soft";
		this.obj.style.textAlign=this.cell.style.textAlign;
		this.obj.onclick=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.onmousedown=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.value=this.text
		this.obj.onselectstart=function(e){
			if (!e)
				e=event;
			e.cancelBubble=true;
			return true;
		};
		var editor_obj = this;
		this.obj.onkeyup=function(e){
			var key=(e||event).keyCode;
			if (key==38 || key==40 || key==9) return;
			var val = this.readonly ? String.fromCharCode(key) : this.value;
			
			var c = editor_obj.list.options;

			for (var i = 0; i < c.length; i++)
				if (c[i].text.indexOf(val) == 0)
					return c[i].selected=true;
		}
		this.list=document.createElement("SELECT");

		this.list.className='dhx_combo_select';
		this.list.style.width=this.cell.offsetWidth+"px";
		this.list.style.left=arPos[0]+"px";                       //arPos[0]
		this.list.style.top=arPos[1]+this.cell.offsetHeight+"px"; //arPos[1]+this.cell.offsetHeight;
		this.list.onclick=function(e){
			var ev = e||window.event;
			var cell = ev.target||ev.srcElement

			//tbl.editor_obj.val=cell.combo_val;
			if (cell.tagName == "OPTION")
				cell=cell.parentNode;
			//editor_obj.list.value = cell.value;
			editor_obj.editable=false;
			editor_obj.grid.editStop();
			ev.cancelBubble = true;
		}
		var comboKeys = this.combo.getKeys();
		var fl = false
		var selOptId = 0;

		for (var i = 0; i < comboKeys.length; i++){
			var val = this.combo.get(comboKeys[i])
			this.list.options[this.list.options.length]=new Option(val, comboKeys[i]);

			if (comboKeys[i] == this.val){
				selOptId=this.list.options.length-1;
				fl=true;
			}
		}

		if (fl == false){ //if no such value in combo list
			this.list.options[this.list.options.length]=new Option(this.text, this.val === null ? "" : this.val);
			selOptId=this.list.options.length-1;
		}
		document.body.appendChild(this.list) //nb:this.grid.objBox.appendChild(this.listBox);
		this.list.size="6";
		this.cstate=1;

		if (this.editable){
			this.cell.innerHTML="";
		}
		else {
			this.obj.style.width="0px";
			this.obj.style.height="0px";
		}
		this.cell.appendChild(this.obj);
		this.list.options[selOptId].selected=true;

		//fix for coro - FF scrolls grid in incorrect position
		if (this.editable){
			this.obj.focus();
			this.obj.focus();
		}

		if (!this.editable){
			this.obj.style.visibility="hidden";
			this.obj.style.position="absolute";
			this.list.focus();
			this.list.onkeydown=function(e){
				e=e||window.event;
				editor_obj.grid.setActive(true)

				if (e.keyCode < 30)
					return editor_obj.grid.doKey({
						target: editor_obj.cell,
						keyCode: e.keyCode,
						shiftKey: e.shiftKey,
						ctrlKey: e.ctrlKey
						})
			}
		}
	}

	this.getValue=function(){
		return ((this.cell.combo_value == window.undefined) ? "" : this.cell.combo_value);
	}
	this.detach=function(){
		if (this.val != this.getValue()){
			this.cell.wasChanged=true;
		}

		if (this.list.parentNode != null){
			if (this.editable){
					var ind = this.list.options[this.list.selectedIndex]
					if (ind&&ind.text == this.obj.value)
						this.setValue(this.list.value)
					else{
						var combo=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex));
						var val=combo.values._dhx_find(this.obj.value);
						if (val!=-1) this.setValue(combo.keys[val]);
						else this.setValue(this.cell.combo_value=this.obj.value);
					}
			}
			else
				this.setValue(this.list.value)
		}

		if (this.list.parentNode)
			this.list.parentNode.removeChild(this.list);

		if (this.obj.parentNode)
			this.obj.parentNode.removeChild(this.obj);

		return this.val != this.getValue();
	}
}
eXcell_co.prototype=new eXcell;
eXcell_co.prototype.getText=function(){
	return this.cell.innerHTML;
}
eXcell_co.prototype.setValue=function(val){
	if (typeof (val) == "object"){
		var optCol = dhx4.ajax.xpath("./option", val);

		if (optCol.length)
			this.cell._combo=new dhtmlXGridComboObject();

		for (var j = 0;
			j < optCol.length;
			j++)this.cell._combo.put(optCol[j].getAttribute("value"),
			optCol[j].firstChild
				? optCol[j].firstChild.data
				: "");
		val=val.firstChild.data;
	}

	if ((val||"").toString()._dhx_trim() == "")
		val=null
	this.cell.combo_value=val;
	
	if (val !== null){
		var label = (this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(val);
		this.setCValue(label===null?val:label, val);
	}else
		this.setCValue("&nbsp;", val);

	
}
/**
*	@desc: selectbox editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_coro(cell){
	this.base=eXcell_co;
	this.base(cell)
	this.editable=false;
}
eXcell_coro.prototype=new eXcell_co;

function eXcell_cotxt(cell){
	this.base=eXcell_co;
	this.base(cell)
}
eXcell_cotxt.prototype=new eXcell_co;
eXcell_cotxt.prototype.getText=function(){
	return (_isIE ? this.cell.innerText : this.cell.textContent);
}
eXcell_cotxt.prototype.setValue=function(val){
	if (typeof (val) == "object"){
		var optCol = dhx4.ajax.xpath("./option", val);

		if (optCol.length)
			this.cell._combo=new dhtmlXGridComboObject();

		for (var j = 0;
			j < optCol.length;
			j++)this.cell._combo.put(optCol[j].getAttribute("value"),
			optCol[j].firstChild
				? optCol[j].firstChild.data
				: "");
		val=val.firstChild.data;
	}

	if ((val||"").toString()._dhx_trim() == "")
		val=null

	if (val !== null)
		this.setCTxtValue((this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(val)||val, val);
	else
		this.setCTxtValue(" ", val);

	this.cell.combo_value=val;
}

function eXcell_corotxt(cell){
	this.base=eXcell_co;
	this.base(cell)
	this.editable=false;
}
eXcell_corotxt.prototype=new eXcell_cotxt;
//#}

//#cp_excell:04062008{
/**
*	@desc: color picker editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_cp(cell){
	try{
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	catch (er){}
	this.edit=function(){
		this.val=this.getValue()
		this.obj=document.createElement("SPAN");
		this.obj.style.border="1px solid black";
		this.obj.style.position="absolute";
		var arPos = this.grid.getPosition(this.cell); //,this.grid.objBox
		this.colorPanel(4, this.obj)
		document.body.appendChild(this.obj);          //this.grid.objBox.appendChild(this.obj);
		this.obj.style.left=arPos[0]+"px";
		this.obj.style.zIndex=1000;
		this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";
	}
	this.toolDNum=function(value){
		if (value.length == 1)
			value='0'+value;
		return value;
	}
	this.colorPanel=function(index, parent){
		var tbl = document.createElement("TABLE");
		parent.appendChild(tbl)
		tbl.cellSpacing=0;
		tbl.editor_obj=this;
		tbl.style.cursor="default";
		tbl.onclick=function(e){
			var ev = e||window.event
			var cell = ev.target||ev.srcElement;
			var ed = cell.parentNode.parentNode.parentNode.editor_obj
			if (ed){
				ed.setValue(cell._bg);
				ed.grid.editStop();
			}
		}
		var cnt = 256 / index;
		for (var j = 0; j <= (256 / cnt); j++){
			var r = tbl.insertRow(j);

			for (var i = 0; i <= (256 / cnt); i++){
				for (var n = 0; n <= (256 / cnt); n++){
					R=new Number(cnt*j)-(j == 0 ? 0 : 1)
					G=new Number(cnt*i)-(i == 0 ? 0 : 1)
					B=new Number(cnt*n)-(n == 0 ? 0 : 1)
					var rgb =
						this.toolDNum(R.toString(16))+""+this.toolDNum(G.toString(16))+""+this.toolDNum(B.toString(16));
					var c = r.insertCell(i);
					c.width="10px";
					c.innerHTML="&nbsp;"; //R+":"+G+":"+B;//
					c.title=rgb.toUpperCase()
					c.style.backgroundColor="#"+rgb
					c._bg="#"+rgb;

					if (this.val != null&&"#"+rgb.toUpperCase() == this.val.toUpperCase()){
						c.style.border="2px solid white"
					}
				}
			}
		}
	}
	this.getValue=function(){
		return this.cell.firstChild._bg||""; //this.getBgColor()
	}
	this.getRed=function(){
		return Number(parseInt(this.getValue().substr(1, 2), 16))
	}
	this.getGreen=function(){
		return Number(parseInt(this.getValue().substr(3, 2), 16))
	}
	this.getBlue=function(){
		return Number(parseInt(this.getValue().substr(5, 2), 16))
	}
	this.detach=function(){
		if (this.obj.offsetParent != null)
			document.body.removeChild(this.obj);
		//this.obj.removeNode(true)
		return this.val != this.getValue();
	}
}
eXcell_cp.prototype=new eXcell;
eXcell_cp.prototype.setValue=function(val){
    this.setCValue("<div style='width:100%;height:"+((this.grid.multiLine?"100%":23))+";background-color:"+(val||"")
		+";border:0px;'>&nbsp;</div>",
		val);
	this.cell.firstChild._bg=val;
}
//#}

//#img_excell:04062008{
/**
*	@desc: image editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
/*
	The corresponding  cell value in XML should be a "^" delimited list of following values:
	1st - image src
	2nd - image alt text (optional)
	3rd - link (optional)
	4rd - target (optional, default is _self)
*/
function eXcell_img(cell){
	try{
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	catch (er){}
	this.getValue=function(){
		if (this.cell.firstChild.tagName == "IMG")
			return this.cell.firstChild.src+(this.cell.titFl != null
				? "^"+this.cell._brval
				: "");
			else if (this.cell.firstChild.tagName == "A"){
			var out = this.cell.firstChild.firstChild.src+(this.cell.titFl != null ? "^"+this.cell._brval : "");
			out+="^"+this.cell.lnk;

			if (this.cell.trg)
				out+="^"+this.cell.trg
			return out;
		}
	}
	this.isDisabled=function(){
		return true;
	}
}
eXcell_img.prototype=new eXcell;
eXcell_img.prototype.getTitle=function(){
	return this.cell._brval
}
eXcell_img.prototype.setValue=function(val){
	var title = val;

	if ((val||"").indexOf("^") != -1){
		var ar = val.split("^");
		val=ar[0]
		title=this.cell._attrs.title||ar[1];

		//link
		if (ar.length > 2){
			this.cell.lnk=ar[2]

			if (ar[3])
				this.cell.trg=ar[3]
		}
		this.cell.titFl="1";
	}
	if (!this.grid.multiLine)
		this.setCValue("<img src='"+this.grid.iconURL+(val||"")._dhx_trim()+"' border='0' style='max-height:"+(this.grid._srdh-4)+"px'>", val);
	else
		this.setCValue("<img src='"+this.grid.iconURL+(val||"")._dhx_trim()+"' border='0'>", val);

	if (this.cell.lnk){
		this.cell.innerHTML="<a href='"+this.cell.lnk+"' target='"+this.cell.trg+"'>"+this.cell.innerHTML+"</a>"
	}
	this.cell._brval=title;
}
function eXcell_icon(cell){
	this.base=eXcell_ed;
	this.base(cell)
	try{
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	catch (er){}

	this.setValue=function(val){
		this.cell._raw_value = val;
		this.setCValue('<div class="dhx_grid_icon"><i class="fa fa-'+val.toString()._dhx_trim()+'"></i></div>');
	}
	this.getValue=function(){
		return this.cell._raw_value;
	}
	this.isDisabled=function(){
		return true;
	}
}
eXcell_icon.prototype=new eXcell_ed;
//#}

//#price_excell:04062008{
/**
*	@desc: text editor with price (USD) formatting
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_price(cell){
	this.base=eXcell_ed;
	this.base(cell)
	this.getValue=function(){
		if (this.cell.childNodes.length > 1)
			return this.cell.childNodes[1].innerHTML.toString()._dhx_trim()
		else
			return "0";
	}
}

eXcell_price.prototype=new eXcell_ed;
eXcell_price.prototype.setValue=function(val){
	if (isNaN(parseFloat(val))){
		val=this.val||0;
	}
	var color = "green";

	if (val < 0)
		color="red";

	this.setCValue("<span>$</span><span style='padding-right:2px;color:"+color+";'>"+val+"</span>", val);
}
//#}

//#dyn_excells:04062008{
/**
*	@desc: text editor with additional formatting for positive and negative numbers (arrow down/up and color)
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_dyn(cell){
	this.base=eXcell_ed;
	this.base(cell)
	this.getValue=function(){
		if (!this.cell.firstChild.childNodes[1]) return "";
		var value = this.cell.firstChild.childNodes[1].innerHTML.toString()._dhx_trim()
		var k = this.grid._aplNFb(value, this.cell._cellIndex);
		if (isNaN(Number(k))) {
			return value;
		}
		return k;
	}
}

eXcell_dyn.prototype=new eXcell_ed;
eXcell_dyn.prototype.getValue=function(){
	var value = eXcell_ed.prototype.getValue.call(this);
	return 
	
}
eXcell_dyn.prototype.setValue=function(val){
	if (!val||isNaN(Number(val))){
		if (val!=="")
			val=0;
	} else {
		if (val > 0){
			var color = "green";
			var img = "dyn_up.gif";
		} else if (val == 0){
			var color = "black";
			var img = "dyn_.gif";
		} else {
			var color = "red";
			var img = "dyn_down.gif";
		}
		val = this.grid._aplNF(val, this.cell._cellIndex);
	}

	this.setCValue("<div class='grid_cell_dyn'><img src='"+this.grid.imgURL+""+img
		+"'><span style='color:"+color+";'>"+val
		+"</span></div>",
		val);
}
//#}

/**
*	@desc: readonly editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ro(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.getValue=function(){
		return this.cell._clearCell?"":this.cell.innerHTML.toString()._dhx_trim();
	}
}
eXcell_ro.prototype=new eXcell;


window.eXcell_hidden = function(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.getValue=function(){
		return this.cell.val;
	}
}
eXcell_hidden.prototype=new eXcell;
eXcell_hidden.prototype.setValue = function(value){
	this.cell.val = value;
}

function eXcell_ron(cell){
	this.cell=cell;
	this.grid=this.cell.parentNode.grid;
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.getValue=function(){
		return this.cell._clearCell?"":this.cell._orig_value||this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex).toString();
	}
}
eXcell_ron.prototype=new eXcell;
eXcell_ron.prototype.setValue=function(val){ 
	if (val === 0){}
	else if (!val||val.toString()._dhx_trim() == ""){
		this.setCValue("&nbsp;");
		return this.cell._clearCell=true;
	}
	this.cell._orig_value = val;
	this.cell._clearCell=false;
	this.setCValue(val?this.grid._aplNF(val, this.cell._cellIndex):"0");
}


/**
*	@desc: readonly pure text editor (without HTML support)
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_rotxt(cell){
	this.cell=cell;
	this.grid=this.cell.parentNode.grid;
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.setValue=function(val){
		if (!val){
			val=" ";
			this.cell._clearCell = true;
		}
		else
			this.cell._clearCell = false;
			
		this.setCTxtValue(val);
	}
	this.getValue=function(){
		if (this.cell._clearCell)
			return "";
		return (_isIE ? this.cell.innerText : this.cell.textContent);
	}	
}
eXcell_rotxt.prototype=new eXcell;

/**
	*	@desc: combobox object constructor (shouldn't be accessed directly - instead please use getCombo(...) method of the grid)
	*	@type: private
	*	@returns: combobox for dhtmlxGrid
	*/
function dhtmlXGridComboObject(){
	this.keys=new dhtmlxArray();
	this.values=new dhtmlxArray();
	/**
	*	@desc: puts new combination of key and value into combobox
	*	@type: public
	*	@param: key - object to use as a key (should be a string in the case of combobox)
	*	@param: value - object value of combobox line
	*/
	this.put=function(key, value){
		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] == key){
				this.values[i]=value;
				return true;
			}
		}
		this.values[this.values.length]=value;
		this.keys[this.keys.length]=key;
	}
	/**
	*	@desc: gets value corresponding to the given key
	*	@type: public
	*	@param: key - object to use as a key (should be a string in the case of combobox)
	*	@returns: value correspond. to given key or null if no such key
	*/
	this.get=function(key){
		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] == key){
				return this.values[i];
			}
		}
		return null;
	}
	/**
	*	@desc: clears combobox
	*	@type: public
	*/
	this.clear=function(){
		/*for(var i=0;i<this.keys.length;i++){
				this.keys._dhx_removeAt(i);
				this.values._dhx_removeAt(i);
		}*/
		this.keys=new dhtmlxArray();
		this.values=new dhtmlxArray();
	}
	/**
	*	@desc: remove pair of key-value from combobox with given key 
	*	@type: public
	*	@param: key - object to use as a key
	*/
	this.remove=function(key){
		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] == key){
				this.keys._dhx_removeAt(i);
				this.values._dhx_removeAt(i);
				return true;
			}
		}
	}
	/**
	*	@desc: gets the size of combobox 
	*	@type: public
	*	@returns: current size of combobox
	*/
	this.size=function(){
		var j = 0;

		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] != null)
				j++;
		}
		return j;
	}
	/**
	*	@desc: gets array of all available keys present in combobox
	*	@type: public
	*	@returns: array of all available keys
	*/
	this.getKeys=function(){
		var keyAr = new Array(0);

		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] != null)
				keyAr[keyAr.length]=this.keys[i];
		}
		return keyAr;
	}

	/**
	*	@desc: save curent state
	*	@type: public
	*/
	this.save=function(){
		this._save=new Array();

		for (var i = 0; i < this.keys.length; i++)this._save[i]=[
			this.keys[i],
			this.values[i]
		];
	}


	/**
	*	@desc: restore saved state
	*	@type: public
	*/
	this.restore=function(){
		if (this._save){
			this.keys[i]=new Array();
			this.values[i]=new Array();

			for (var i = 0; i < this._save.length; i++){
				this.keys[i]=this._save[i][0];
				this.values[i]=this._save[i][1];
			}
		}
	}
	return this;
}

function Hashtable(){
	this.keys=new dhtmlxArray();
	this.values=new dhtmlxArray();
	return this;
}
Hashtable.prototype=new dhtmlXGridComboObject;

//(c)dhtmlx ltd. www.dhtmlx.com
if (typeof(window.dhtmlXCellObject) != "undefined") {
	
	dhtmlXCellObject.prototype.attachGrid = function(config) {
		
		this.callEvent("_onBeforeContentAttach",["grid"]);
		
		var obj = document.createElement("DIV");
		obj.style.width = "100%";
		obj.style.height = "100%";
		obj.style.position = "relative";
		obj.style.overflow = "hidden";
		this._attachObject(obj);
		
		this.dataType = "grid";
		if (config && typeof config === "object" && !config.tagName){
			config.parent = obj;
			obj = config;
		}
		this.dataObj = new dhtmlXGridObject(obj);
		this.dataObj.setSkin(this.conf.skin);
		
		// fix for grid atatched to tabbar for safari on ios 5.1.7
		if (typeof(window.dhtmlXTabBarCell) == "function" && this instanceof window.dhtmlXTabBarCell && navigator.userAgent.match(/7[\.\d]* mobile/gi) != null && navigator.userAgent.match(/AppleWebKit/gi) != null) {
			this.dataObj.objBox.style.webkitOverflowScrolling = "auto";
		}
		
		// fix layout cell for material
		if (this.conf.skin == "material" && typeof(window.dhtmlXLayoutCell) == "function" && this instanceof window.dhtmlXLayoutCell) {
			this.cell.childNodes[this.conf.idx.cont].style.overflow = "hidden";
		}
		
		
		// keep border for window and remove for other
		if (this.conf.skin == "dhx_skyblue" && typeof(window.dhtmlXWindowsCell) == "function" && this instanceof window.dhtmlXWindowsCell) {
			this.dataObj.entBox.style.border = "1px solid #a4bed4";
			this.dataObj._sizeFix = 0;
		} else {
			this.dataObj.entBox.style.border = "0px solid white";
			this.dataObj._sizeFix = 2;
		}
		
		obj = null;
		
		this.callEvent("_onContentAttach",[]);
		
		return this.dataObj;
	};
	
}

dhtmlXGridObject.prototype._process_xmlA=function(xml){ 
	this._parsing=true;
	var top=dhx4.ajax.xmltop(this.xml.top, xml);
	//#config_from_xml:20092006{
	this._parseHead(top);
	//#}
	var rows=dhx4.ajax.xpath(this.xml.row,top)
	var cr=parseInt(top.getAttribute("pos")||0);
	var total=parseInt(top.getAttribute("total_count")||0);
	if (total && !this.rowsBuffer[total-1]) this.rowsBuffer[total-1]=null;
	
	if (this.isTreeGrid()){
		this._get_xml_data = this._get_xml_dataA;
		this._process_xml_row = this._process_xml_rowA;
		return this._process_tree_xml(xml);
	}
	
	for (var i=0; i < rows.length; i++) {
		if (this.rowsBuffer[i+cr]) continue;
		var id=rows[i].getAttribute("id")||this.uid();
		this.rowsBuffer[i+cr]={ idd:id, data:rows[i], _parser: this._process_xml_rowA, _locator:this._get_xml_dataA };
		this.rowsAr[id]=rows[i];
		//this.callEvent("onRowCreated",[r.idd]);
	}
	this.render_dataset();
	this._parsing=false;
}

dhtmlXGridObject.prototype._process_xmlB=function(xml){
    
    this._parsing=true;
	var top=dhx4.ajax.xmltop(this.xml.top, xml);
	//#config_from_xml:20092006{
	this._parseHead(top);
	//#}
	var rows=dhx4.ajax.xpath(this.xml.row,top)
	var cr=parseInt(top.getAttribute("pos")||0);
	var total=parseInt(top.getAttribute("total_count")||0);
	if (total && !this.rowsBuffer[total-1]) this.rowsBuffer[total-1]=null;
	
	if (this.isTreeGrid()){
		this._get_xml_data = this._get_xml_dataB;
		this._process_xml_row = this._process_xml_rowB;
		return this._process_tree_xml(xml);
	}
			
	for (var i=0; i < rows.length; i++) {
		if (this.rowsBuffer[i+cr]) continue;
		var id=rows[i].getAttribute("id")||this.uid();
		this.rowsBuffer[i+cr]={ idd:id, data:rows[i], _parser: this._process_xml_rowB, _locator:this._get_xml_dataB };
		this.rowsAr[id]=rows[i];
		//this.callEvent("onRowCreated",[r.idd]);
	}
	this.render_dataset();
	this._parsing=false;
}

dhtmlXGridObject.prototype._process_xml_rowA=function(r,xml){
	var strAr = [];
	r._attrs=this._xml_attrs(xml);
	
	//load cell data
    for(var j=0;j<this.columnIds.length;j++){
    	var cid=this.columnIds[j];
    	var cellVal=r._attrs[cid]||"";
        if (r.childNodes[j])
       		r.childNodes[j]._attrs={};
   		
		strAr.push(cellVal);
	}
	    
    //back to common code
	this._fillRow(r,(this._c_order?this._swapColumns(strAr):strAr));
    return r;
}
dhtmlXGridObject.prototype._get_xml_dataA=function(data,ind){
	return data.getAttribute(this.getColumnId(ind));
}

dhtmlXGridObject.prototype._process_xml_rowB=function(r,xml){
	var strAr = [];
	r._attrs=this._xml_attrs(xml);
	
	//load userdata
	if (this._ud_enabled){	
		var udCol = dhx4.ajax.xpath("./userdata",xml);
    	for (var i = udCol.length - 1; i >= 0; i--)
    		this.setUserData(udCol[i].getAttribute("name"),udCol[i].firstChild?udCol[i].firstChild.data:"");
	}
	
	//load cell data
	
	for (var jx=0; jx < xml.childNodes.length; jx++) {
		var cellVal=xml.childNodes[jx];
    	if (!cellVal.tagName) continue;
    	var j=this.getColIndexById(cellVal.tagName);
    	if (isNaN(j)) continue;
    		
        var exc=cellVal.getAttribute("type");
        if (exc)
        	r.childNodes[j]._cellType=exc;
       	r.childNodes[j]._attrs=this._xml_attrs(cellVal);
   		
		if (cellVal.getAttribute("xmlcontent"))
		{}
		else if (cellVal.firstChild)
			cellVal=cellVal.firstChild.data;
		else cellVal="";
        
		strAr[j]=cellVal;
	}
	for (var i=0; i < r.childNodes.length; i++) {
		if (!r.childNodes[i]._attrs) r.childNodes[i]._attrs={};
	};
            
    //back to common code
	this._fillRow(r,strAr);
    return r;
}
dhtmlXGridObject.prototype._get_xml_dataB=function(data,ind){
	var id=this.getColumnId(ind);
	data=data.firstChild;
	while (true){
		if (!data) return "";
		if (data.tagName==id) return (data.firstChild?data.firstChild.data:"")
		data=data.nextSibling;
	}
  return "";
}

/**
*     @desc: enable/disable drag-and-drop
*     @type: public
*     @param: mode - enabled/disabled [ can be true/false/temporary_disabled - last value mean that tree can be D-n-D can be switched to true later ]
*     @topic: 0
*/
   dhtmlXGridObject.prototype.enableDragAndDrop=function(mode){
        if  (mode=="temporary_disabled"){
            this.dADTempOff=false;
            mode=true;                  }
        else
            this.dADTempOff=true;

		this.dragAndDropOff=dhx4.s2b(mode);
		this._drag_validate=true;
		if (mode)
			this.objBox.ondragstart = function (e) {
				(e||event).cancelBubble = true;
				return false;
			}
       };

/**
*     @desc: set Drag-And-Drop behavior (child - drop as chils, sibling - drop as sibling
*     @type: public
*     @param: mode - behavior name (child,sibling,complex)
*     @topic: 0
*/
dhtmlXGridObject.prototype.setDragBehavior=function(mode){
        this.dadmodec=this.dadmodefix=0;
      switch (mode) {
         case "child": this.dadmode=0; this._sbmod=false;  break;
         case "sibling": this.dadmode=1; this._sbmod=false;  break;
         case "sibling-next": this.dadmode=1; this._sbmod=true; break;
         case "complex": this.dadmode=2; this._sbmod=false;  break;
         case "complex-next": this.dadmode=2; this._sbmod=true;  break;
      }    };


/**
*     @desc: switch to mode when draged item, droped in target location in same order as they was in source grid
*     @type: public
*     @param: mode - true/false to enable/disable mode
*     @topic: 0
*/
dhtmlXGridObject.prototype.enableDragOrder=function(mode){
        this._dndorder=dhx4.s2b(mode);
};


dhtmlXGridObject.prototype._checkParent=function(row,ids){
	var z=this._h2.get[row.idd].parent;
	if (!z.parent) return;
	for (var i=0; i<ids.length; i++) 
		if (ids[i]==z.id) return true;
		
	return this._checkParent(this.rowsAr[z.id],ids);
}

/**
*     @desc: create html element for dragging
*     @type: private
*     @param: htmlObject - html node object
*     @topic: 1
*/
dhtmlXGridObject.prototype._createDragNode=function(htmlObject,e){
	  this.editStop();
	  if (window.dhtmlDragAndDrop.dragNode) return null;
      if (!this.dADTempOff) return null;
      htmlObject.parentObject=new Object();
      htmlObject.parentObject.treeNod=this;

	var text=this.callEvent("onBeforeDrag",[htmlObject.parentNode.idd,htmlObject._cellIndex, e]);
	if (!text) return null;

      var z=new Array();
//#__pro_feature:21092006{
      z=this.getSelectedId();
	  z=(((z)&&(z!=""))?z.split(this.delim):[]);
      var exst=false;
      for (var i=0; i<z.length; i++)
        if (z[i]==htmlObject.parentNode.idd)  exst=true;
      if (!exst){
      	this.selectRow(this.rowsAr[htmlObject.parentNode.idd],false,e.ctrlKey,false);
      	if (!e.ctrlKey) {
      		z=[];
  		}
//#}
          z[this.selMultiRows?z.length:0]=htmlObject.parentNode.idd;
//#__pro_feature:21092006{
    }
//#}

	//remove child in case of treeGrid
	if (this.isTreeGrid()){
		for (var i=z.length-1; i>=0; i--) 
			if (this._checkParent(this.rowsAr[z[i]],z)) z.splice(i,1);
				
	}
	

	var self=this;
	if (z.length && this._dndorder)
		z.sort(function(a,b){ return (self.rowsAr[a].rowIndex>self.rowsAr[b].rowIndex?1:-1); });

     var el = this.getFirstParentOfType(_isIE?e.srcElement:e.target,"TD");
     if (el) this._dndExtra=el._cellIndex;
      this._dragged=new Array();
      for (var i=0; i<z.length; i++)
          if (this.rowsAr[z[i]]){
          this._dragged[this._dragged.length]=this.rowsAr[z[i]];
          this.rowsAr[z[i]].treeNod=this;
          }

      htmlObject.parentObject.parentNode=htmlObject.parentNode;

   var dragSpan=document.createElement('div');
   dragSpan.innerHTML=(text!==true?text:this.rowToDragElement(htmlObject.parentNode.idd));
   dragSpan.style.position="absolute";
   dragSpan.className="dragSpanDiv";
   return dragSpan;
}



/**
*   @desc:  create a drag visual marker
*   @type:  private
*/
dhtmlXGridObject.prototype._createSdrgc=function(){
    this._sdrgc=document.createElement("DIV");
    this._sdrgc.innerHTML="&nbsp;";
    this._sdrgc.className="gridDragLine";
    this.objBox.appendChild(this._sdrgc);
}











/**
*   @desc:  create a drag context object
*   @type:  private
*/
function dragContext(a,b,c,d,e,f,j,h,k,l,m){
    this.source=a||"grid";
    this.target=b||"grid";
    this.mode=c||"move";
    this.dropmode=d||"child";
    this.sid=e||0;
    this.tid=f;
    this.sobj=j||null;
    this.tobj=h||null;
   this.sExtra=k||null;
   this.tExtra=l||null;
   this.before=m||false;
    return this;
}
/**
*   @desc:  check is operation possible
*   @type:  private
*/
dragContext.prototype.valid=function(){
   if (this.sobj!=this.tobj) return true;
   if (this.sid==this.tid) return false;
   if (this.target=="treeGrid"){
      var z=this.tid
      while (z = this.tobj.getParentId(z) ){
         if (this.sid==z) return false;
         }
   }
   return true;
}
/**
*   @desc:  close context
*   @type:  private
*/
dragContext.prototype.close=function(){
    this.sobj=null;
    this.tobj=null;
}
/**
*   @desc:  return copy of context
*   @type:  private
*/
dragContext.prototype.copy=function(){
    return new dragContext(this.source,this.target,this.mode,this.dropmode,this.sid,this.tid,this.sobj,this.tobj,this.sExtra,this.tExtra,this.before);
}
/**
*   @desc:  set a lue of context attribute
*   @type:  private
*/
dragContext.prototype.set=function(a,b){
    this[a]=b;
    return this;
}
/**
*   @desc:  generate an Id for new node
*   @type:  private
*/
dragContext.prototype.uid=function(a,b){
    this.nid=this.sid;
    while (this.tobj.rowsAr[this.nid])
        this.nid=this.nid+((new Date()).valueOf());

    return this;
}
/**
*   @desc:  get data array for grid row
*   @type:  private
*/
dragContext.prototype.data=function(){
    if (this.sobj==this.tobj)
        return this.sobj._getRowArray(this.sobj.rowsAr[this.sid]);
    if (this.source=="tree")
        return this.tobj.treeToGridElement(this.sobj,this.sid,this.tid);
    else
        return this.tobj.gridToGrid(this.sid,this.sobj,this.tobj);
}
dragContext.prototype.attrs=function(){
    if (this.source=="tree")
        return {};
    else
        return this.sobj.rowsAr[this.sid]._attrs;
}
dragContext.prototype.childs=function(){
    if (this.source=="treeGrid")
		return this.sobj._h2.get[this.sid]._xml_await?this.sobj._h2.get[this.sid].has_kids:null;
	return null;
}

/**
*   @desc:  return parent id for row in context
*   @type:  private
*/
dragContext.prototype.pid=function(){
    if (!this.tid) return 0;
	if (!this.tobj._h2) return 0;
    if (this.target=="treeGrid")
        if (this.dropmode=="child")
            return this.tid;
        else{
			var z=this.tobj.rowsAr[this.tid];
			var apid=this.tobj._h2.get[z.idd].parent.id;
			if ((this.alfa)&&(this.tobj._sbmod)&&(z.nextSibling)){
				var zpid=this.tobj._h2.get[z.nextSibling.idd].parent.id;
				if (zpid==this.tid)
            		return this.tid;
				if (zpid!=apid)
            		return zpid;
			}
	        return apid;
	   }
}
/**
*   @desc:  get index of target position
*   @type:  private
*/
dragContext.prototype.ind=function(){ 
    if (this.tid==window.unknown) return this.tobj.rowsBuffer.length;
    if (this.target=="treeGrid"){
      if (this.dropmode=="child")
            this.tobj.openItem(this.tid);
      else
         this.tobj.openItem(this.tobj.getParentId(this.tid));
   }
    var ind=this.tobj.rowsBuffer._dhx_find(this.tobj.rowsAr[this.tid]);
	if ((this.alfa)&&(this.tobj._sbmod)&&(this.dropmode=="sibling")){
		var z=this.tobj.rowsAr[this.tid];
		if ((z.nextSibling)&&(this._h2.get[z.nextSibling.idd].parent.id==this.tid))
			return ind+1;
	}

    return (ind+1+((this.target=="treeGrid" && ind>=0 && this.tobj._h2.get[this.tobj.rowsBuffer[ind].idd].state=="minus")?this.tobj._getOpenLenght(this.tobj.rowsBuffer[ind].idd,0):0));
}

/**
*   @desc:  get row related image
*   @type:  private
*/
dragContext.prototype.img=function(){
    if ((this.target!="grid")&&(this.sobj._h2))
      return this.sobj.getItemImage(this.sid);
   else return null;
}

/**
*   @desc:  return list of rows in context
*   @type:  private
*/
dragContext.prototype.slist=function(){
    var res=new Array();
    for (var i=0; i<this.sid.length; i++)
        res[res.length]=this.sid[i][(this.source=="tree")?"id":"idd"];

    return res.join(",");
}


/**
*   @desc:  drag entry point
*   @type:  private
*/
dhtmlXGridObject.prototype._drag=function(sourceHtmlObject,dhtmlObject,targetHtmlObject,lastLanding){
   if (this._realfake) return this._fake._drag();

   var z=(this.lastLanding)
    //close unfinished tasks
    if  (this._autoOpenTimer) window.clearTimeout(this._autoOpenTimer);

    //detect details
    var r1=targetHtmlObject.parentNode;
    var r2=sourceHtmlObject.parentObject;
    //drop on header
    if (!r1.idd) { r1.grid=this;    this.dadmodefix=0; }

    var c=new dragContext(0,0,0,((r1.grid.dadmode==1 || r1.grid.dadmodec)?"sibling":"child"));


    if (r2 && r2.childNodes)
        c.set("source","tree").set("sobj",r2.treeNod).set("sid",c.sobj._dragged);
    else{
    	if (!r2) return true;
        if (r2.treeNod.isTreeGrid && r2.treeNod.isTreeGrid())
        	c.set("source","treeGrid");
        c.set("sobj",r2.treeNod).set("sid",c.sobj._dragged);
        }

    if (r1.grid.isTreeGrid())
        c.set("target","treeGrid");
	else
		c.set("dropmode","sibling");
    c.set("tobj",r1.grid).set("tid",r1.idd);

//#__pro_feature:21092006{
    //complex drag mode - adjust tartget element
    if (((c.tobj.dadmode==2)&&(c.tobj.dadmodec==1))&&(c.tobj.dadmodefix<0))
       if (c.tobj.obj.rows[1].idd!=c.tid) c.tid=r1.previousSibling.idd;
       else {
         if (this._h2 && c.tid)
           c.before = true;
         else c.tid=0;
       }
//#}

   var el = this.getFirstParentOfType(lastLanding,"TD")
   if (el) c.set("tExtra",el._cellIndex);
   if (el) c.set("sExtra",c.sobj._dndExtra);

    if (c.sobj.dpcpy) c.set("mode","copy");
    
    if (c.tobj._realfake) c.tobj=c.tobj._fake;
    if (c.sobj._realfake) c.sobj=c.sobj._fake;
    
    c.tobj._clearMove();
    
	if (r2 && r2.treeNod && r2.treeNod._nonTrivialRow)
		r2.treeNod._nonTrivialRow(this,c.tid,c.dropmode,r2);
	else {
		c.tobj.dragContext=c;
	    if (!c.tobj.callEvent("onDrag",[c.slist(),c.tid,c.sobj,c.tobj,c.sExtra,c.tExtra]))  return  c.tobj.dragContext=null;
	
	   //all ready, start mantras
	   var result=new Array();
	   if (typeof(c.sid)=="object"){
	        var nc=c.copy();
	        for (var i=0; i<c.sid.length; i++){
	         if (!nc.set("alfa",(!i)).set("sid",c.sid[i][(c.source=="tree"?"id":"idd")]).valid()) continue;
	            nc.tobj._dragRoutine(nc);
	            if (nc.target=="treeGrid" && nc.dropmode == "child") nc.tobj.openItem(nc.tid);
	            result[result.length]=nc.nid;
	         nc.set("dropmode","sibling").set("tid",nc.nid);
	            }
	        nc.close();
	        }
	    else
	       c.tobj._dragRoutine(c);		

	   //finish math if any awaiting
	   if (c.tobj.laterLink) c.tobj.laterLink();
	   //destroy context
		c.tobj.callEvent("onDrop",[c.slist(),c.tid,result.join(","),c.sobj,c.tobj,c.sExtra,c.tExtra]);
	}

   c.tobj.dragContext=null;
   c.close();
}


/**
*   @desc:  context drag routine
*   @type:  private
*/
dhtmlXGridObject.prototype._dragRoutine=function(c){
      if ((c.sobj==c.tobj)&&(c.source=="grid")&&(c.mode=="move")&&!this._fake){
         //special case for moving rows in same grid
         if (c.sobj._dndProblematic) return;
         var fr=c.sobj.rowsAr[c.sid];
         var bind=c.sobj.rowsCol._dhx_find(fr);
         c.sobj.rowsCol._dhx_removeAt(c.sobj.rowsCol._dhx_find(fr));
         c.sobj.rowsBuffer._dhx_removeAt(c.sobj.rowsBuffer._dhx_find(fr));
         c.sobj.rowsBuffer._dhx_insertAt(c.ind(),fr);
         if (c.tobj._fake){
         	c.tobj._fake.rowsCol._dhx_removeAt(bind);
         	var tr=c.tobj._fake.rowsAr[c.sid];
         	tr.parentNode.removeChild(tr);
     	 }         
         c.sobj._insertRowAt(fr,c.ind()-(this.pagingOn?((this.currentPage-1)*this.rowsBufferOutSize):0));

         c.nid=c.sid;
         c.sobj.callEvent("onGridReconstructed",[]);
         return;
      }
      var new_row;
		if (this._h2 && typeof c.tid !="undefined" && c.dropmode=="sibling" && (this._sbmod || c.tid)){
      if (c.before)
        new_row=c.uid().tobj.addRowBefore(c.nid,c.data(),c.tid,c.img(),c.childs());
			else if (c.alfa && this._sbmod && this._h2.get[c.tid].childs.length){
				this.openItem(c.tid)
				new_row=c.uid().tobj.addRowBefore(c.nid,c.data(),this._h2.get[c.tid].childs[0].id,c.img(),c.childs());
			}
			else
		  	new_row=c.uid().tobj.addRowAfter(c.nid,c.data(),c.tid,c.img(),c.childs());
		}
		else
        	new_row=c.uid().tobj.addRow(c.nid,c.data(),c.ind(),c.pid(),c.img(),c.childs());

          new_row._attrs = c.attrs();
		
		
        if (c.source=="tree"){
        	this.callEvent("onRowAdded",[c.nid]);            
            var sn=c.sobj._globalIdStorageFind(c.sid);
            if (sn.childsCount){
                var nc=c.copy().set("tid",c.nid).set("dropmode",c.target=="grid"?"sibling":"child");
              for(var j=0;j<sn.childsCount;j++){
                    c.tobj._dragRoutine(nc.set("sid",sn.childNodes[j].id));
                    if (c.mode=="move") j--;
                    }
                nc.close();
                }
        }
        else{
            c.tobj._copyUserData(c);
			this.callEvent("onRowAdded",[c.nid]);            
			
            if ((c.source=="treeGrid")){
            	
            	if (c.sobj==c.tobj) new_row._xml=c.sobj.rowsAr[c.sid]._xml;
                var snc=c.sobj._h2.get[c.sid];
                if ((snc)&&(snc.childs.length)){
                    var nc=c.copy().set("tid",c.nid);
                    if(c.target=="grid")
                        nc.set("dropmode","sibling");
                    else {
                        if (!nc.tobj.kidsXmlFile)
                    	   nc.tobj.openItem(c.tid);
                        nc.set("dropmode","child");
                        }
					var l=snc.childs.length;
                    if (!nc.tobj.kidsXmlFile)
                    for(var j=0;j<l;j++){
                    	c.sobj.render_row_tree(null,snc.childs[j].id);
                        c.tobj._dragRoutine(nc.set("sid",snc.childs[j].id));
                        if (l!=snc.childs.length) {  j--; l=snc.childs.length; }
                        }
                    nc.close();
                    }
            }
        }

        if (c.mode=="move"){
           c.sobj[(c.source=="tree")?"deleteItem":"deleteRow"](c.sid);
           if ((c.sobj==c.tobj)&&(!c.tobj.rowsAr[c.sid])) {
               c.tobj.changeRowId(c.nid,c.sid);
            c.nid=c.sid;
         }
      }
}


/**
*   @desc: redefine this method in your code to define how grid row values should be used in another grid
*   @param: rowId - id of draged row
*   @param: sgrid - source grid object
*   @param: tgrid - target grid object
*   @returns: array of values for cells in target grid row
*   @type: public
*   @topic: 7
*/
dhtmlXGridObject.prototype.gridToGrid = function(rowId,sgrid,tgrid){
    var z=new Array();
    for (var i=0; i<sgrid.hdr.rows[0].cells.length; i++)
        z[i]=sgrid.cells(rowId,i).getValue();
   return z;
}

/**
*   @desc:  check if d-n-d is in allowed rules
*   @type:  private
*/
dhtmlXGridObject.prototype.checkParentLine=function(node,id){
    if ((!this._h2)||(!id)||(!node)) return false;
    if (node.id==id) return true;
    else return this.checkParentLine(node.parent,id);
}

/**
*   @desc:  called when drag moved over landing
*   @type:  private
*/
dhtmlXGridObject.prototype._dragIn=function(htmlObject,shtmlObject,x,y){
                    if (!this.dADTempOff) return 0;
                    var tree=this.isTreeGrid();
                    var obj=shtmlObject.parentNode.idd?shtmlObject.parentNode:shtmlObject.parentObject;
                    
					if (this._drag_validate){
                    	if(htmlObject.parentNode==shtmlObject.parentNode)
                        	return 0;
                        	
	                    if ((tree)&&(this==obj.grid)&&((this.checkParentLine(this._h2.get[htmlObject.parentNode.idd],shtmlObject.parentNode.idd))))
    	                    return 0;
    	            }
                    if (!this.callEvent("onDragIn",[obj.idd||obj.id,htmlObject.parentNode.idd,obj.grid||obj.treeNod,(htmlObject.grid||htmlObject.parentNode.grid)]))
                        return this._setMove(htmlObject,x,y,true);

                    this._setMove(htmlObject,x,y);

                  if ((tree)&&(htmlObject.parentNode.expand!="")){
                    var self = this;
                    this._autoOpenTimer=window.setTimeout(function(){
                      self._autoOpenItem(null, self);
                      self = null;
                    },1000);
                    this._autoOpenId=htmlObject.parentNode.idd;
                  }
                  else
                    if  (this._autoOpenTimer) window.clearTimeout(this._autoOpenTimer);

                    return htmlObject;
}
/**
*   @desc:  open item on timeout
*   @type:  private
*/
dhtmlXGridObject.prototype._autoOpenItem=function(e,gridObject){
	   gridObject.openItem(gridObject._autoOpenId);
}

/**
*   @desc:  called on onmouseout event , when drag out landing zone
*   @type:  private
*/
dhtmlXGridObject.prototype._dragOut=function(htmlObject){
                    this._clearMove();
                    var obj=htmlObject.parentNode.parentObject?htmlObject.parentObject.id:htmlObject.parentNode.idd;
                    this.callEvent("onDragOut",[obj]);
                    if  (this._autoOpenTimer) window.clearTimeout(this._autoOpenTimer);
}
/**
*   @desc:  set visual effect for moving row over landing
*   @type:  private
*/
dhtmlXGridObject.prototype._setMove=function(htmlObject,x,y,skip){
   if (!htmlObject.parentNode.idd) return;
   var a1=dhx4.absTop(htmlObject);
   var a2=dhx4.absTop(this.objBox);
   

   //scroll down
   if ( (a1-a2)>(parseInt(this.objBox.offsetHeight)-50) )
      this.objBox.scrollTop=parseInt(this.objBox.scrollTop)+20;
   //scroll top
   if ( (a1-a2+parseInt(this.objBox.scrollTop))<(parseInt(this.objBox.scrollTop)+30) )
      this.objBox.scrollTop=parseInt(this.objBox.scrollTop)-20;
      
   if (skip) return 0;
   
    if (this.dadmode==2)
    {

        var z=y-a1+(document.body.scrollTop||document.documentElement.scrollTop)-2-htmlObject.offsetHeight/2;
        if ((Math.abs(z)-htmlObject.offsetHeight/6)>0)
        {
        this.dadmodec=1;
      //sibbling zone
        if (z<0)  this.dadmodefix=-1; else   this.dadmodefix=1;
        }
        else this.dadmodec=0;
    }
    else
        this.dadmodec=this.dadmode;




    if (this.dadmodec){
      if (!this._sdrgc) this._createSdrgc();
      this._sdrgc.style.display="block";
      this._sdrgc.style.top=a1-a2+parseInt(this.objBox.scrollTop)+((this.dadmodefix>=0)?htmlObject.offsetHeight:0)+"px";
    }
    else{
      this._llSelD=htmlObject;
      if (htmlObject.parentNode.tagName=="TR")
      for (var i=0; i<htmlObject.parentNode.childNodes.length; i++)
      {
      var z= htmlObject.parentNode.childNodes[i];
	  z._bgCol=z.style.backgroundColor;
      z.style.backgroundColor="#FFCCCC";
      }
    }
}
/**
*   @desc:  remove all visual effects
*   @type:  private
*/
dhtmlXGridObject.prototype._clearMove=function(){
    if (this._sdrgc) this._sdrgc.style.display="none";
    if ((this._llSelD)&&(this._llSelD.parentNode.tagName=="TR")){
    	var coll = this._llSelD.parentNode.childNodes;
        for (var i=0; i<coll.length; i++)
           coll[i].style.backgroundColor=coll[i]._bgCol;
	}       

    this._llSelD=null;
}


/**
*   @desc: redefine this method in your code to define how grid row values should be displaied while draging
*   @param: gridRowId - id of grid row
*   @returns: html string representing dragging row 
*   @type: public
*   @topic: 7
*/
dhtmlXGridObject.prototype.rowToDragElement=function(gridRowId){
    var out=this.cells(gridRowId,0).getValue();
    return out;
}








/**
*   @desc:  copy user data for row
*   @type:  private
*/
dhtmlXGridObject.prototype._copyUserData = function(c){
			if(!c.tobj.UserData[c.nid] || c.tobj!=c.sobj)
            	c.tobj.UserData[c.nid] = new Hashtable();
            else return;

            var z1 = c.sobj.UserData[c.sid];
            var z2 = c.tobj.UserData[c.nid];
            if (z1) {
                z2.keys = z2.keys.concat(z1.keys);
                z2.values = z2.values.concat(z1.values);
            }
    }



/**
*     @desc: move row
*     @type:  public
*     @param: rowId - source row Id
*     @param: mode - moving mode (up,down,row_sibling)
*     @param: targetId - target row  in row_sibling mode
*     @param: targetGrid - used for moving between grids (optional)
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.moveRow=function(rowId,mode,targetId,targetGrid){
      switch(mode){
      case "row_sibling":
                    this.moveRowTo(rowId,targetId,"move","sibling",this,targetGrid);
         break;
      case "up":
               this.moveRowUp(rowId);
         break;
      case "down":
               this.moveRowDown(rowId);
          break;
      }
}





//#__pro_feature:21092006{

/**
*   @desc: move rows from grid to tree
*   @param: tree - object of tree
*   @param: targetObject - target node of tree
*   @param: beforeNode - anchor node of tree
*   @param: itemObject - dragged node
*   @param: z2 - flag of recursion
*   @type:  private
*   @edition: Professional
*   @topic: 7
*/
dhtmlXGridObject.prototype._nonTrivialNode=function(tree,targetObject,beforeNode,itemObject,z2)
{
    if ((tree.callEvent)&&(!z2))
          if (!tree.callEvent("onDrag",[itemObject.idd,targetObject.id,(beforeNode?beforeNode.id:null),this,tree])) return false;

    var gridRowId = itemObject.idd;
    var treeNodeId = gridRowId;
    while (tree._idpull[treeNodeId]) treeNodeId+=(new Date()).getMilliseconds().toString();

   var img=(this.isTreeGrid()?this.getItemImage(gridRowId):"")
	if (beforeNode){
		for (i=0; i<targetObject.childsCount; i++)
		    if (targetObject.childNodes[i]==beforeNode) break;
		
		if (i!=0)
		    beforeNode=targetObject.childNodes[i-1];
		else{
		    st="TOP";
		    beforeNode="";
		    }
	}   
   var newone=tree._attachChildNode(targetObject,treeNodeId,this.gridToTreeElement(tree,treeNodeId,gridRowId),"",img,img,img,"","",beforeNode);
    if (this._h2){
      var akids=this._h2.get[gridRowId];
      if (akids.childs.length)
      for (var i=0; i<akids.childs.length; i++){
          this._nonTrivialNode(tree,newone,0,this.rowsAr[akids.childs[i].id],1);
          if (!this.dpcpy) i--;
      }
    }

    if (!this.dpcpy) this.deleteRow(gridRowId);

    if ((tree.callEvent)&&(!z2))
       tree.callEvent("onDrop",[treeNodeId,targetObject.id,(beforeNode?beforeNode.id:null),this,tree]);
}

/**
*   @desc: redefine this method in your code to define how grid row values should be used in tree (using input parameters you can change id of new tree node, set label, set userdata blocks etc.).
*   @param: treeObj - object of tree
*   @param: treeNodeId - id of node created in tree
*   @param: gridRowId - id of grid row
*   @returns: if true, then grid row will be moved to tree, else - copied
*   @type: public
*   @edition: Professional
*   @topic: 7
*/
dhtmlXGridObject.prototype.gridToTreeElement = function(treeObj,treeNodeId,gridRowId){
   return this.cells(gridRowId,0).getValue();
}

/**
*   @desc: redefine this method in your code to define how tree node values should be used in grid (using input parameters you can change id of new row, values for cells, userdata blocks etc.).
*   @param: treeObj - object of tree
*   @param: treeNodeId - id of node created in tree
*   @param: gridRowId - id of grid row
*   @returns: if true, then tree node should be moved to grid, else - copied
*   @type: public
*   @edition: Professional
*   @topic: 7
*/
dhtmlXGridObject.prototype.treeToGridElement = function(treeObj,treeNodeId,gridRowId){
    var w=new Array();
    var z=this.cellType._dhx_find("tree");
   if (z==-1) z=0;
   for(var i=0;i<this.getColumnCount();i++)
        w[w.length]=(i!=z)?(treeObj.getUserData(treeNodeId,this.getColumnId(i))||""):treeObj.getItemText(treeNodeId);
   return w;
}

/**
*     @desc: move row
*     @type:  public
*     @param: srowId - source row Id
*     @param: trowId - target row Id
*     @param: mode - move or copy
*     @param: dropmode - sibling or child
*     @param: sourceGrid - target row  in row_sibling mode
*     @param: targetGrid - used for moving between grids (optional)
*     @returns: moved item ID
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.moveRowTo=function(srowId,trowId,mode,dropmode,sourceGrid,targetGrid){
    var c=new dragContext((sourceGrid||this).isTreeGrid()?"treeGrid":"grid",(targetGrid||this).isTreeGrid()?"treeGrid":"grid",mode,dropmode||"sibling",srowId,trowId,sourceGrid||this,targetGrid||this);
    c.tobj._dragRoutine(c);
    c.close();
    return c.nid;
}

/**
*     @desc: enable drag without removing (copy instead of move)
*     @beforeInit: 1
*     @param: mode - 1 - on, 0 - off;
*     @type: public
*     @edition:Professional
*     @topic: 0
*/
dhtmlXGridObject.prototype.enableMercyDrag=function(mode){ this.dpcpy=dhx4.s2b(mode); };

dhtmlXGridObject.prototype.toPDF=function(url,mode,header,footer,rows,target){
	var save_sel = {
		row: (this.getSelectedRowId()||"").split(this.delim),
		col: this.getSelectedCellIndex()
	};
	if (save_sel.row === null || save_sel.col === -1)
		save_sel = false;
	else {
		if (save_sel.row){
			for (var i=0; i<save_sel.row.length; i++){
				if (save_sel.row[i]){
					var el = this.cells(save_sel.row[i], save_sel.col).cell;
					el.parentNode.className = el.parentNode.className.replace(' rowselected', '');
					el.className = el.className.replace(' cellselected', '');
					save_sel.row[i] = el;
				}
			}
		} else 
			save_sel = false;
	}
	mode = mode || "color";	
	var full_color = mode == "full_color";
	var grid = this;
	grid._asCDATA = true;
	if (typeof(target) === 'undefined')
		this.target = " target=\"_blank\"";
	else
		this.target = target;
		
	eXcell_ch.prototype.getContent = function(){
		return this.getValue();
	};
	eXcell_ra.prototype.getContent = function(){
		return this.getValue();
	};
	function xml_top(profile) {
		var spans = [];
		for (var i=1; i<grid.hdr.rows.length; i++){
			spans[i]=[];
			for (var j=0; j<grid._cCount; j++){
				var cell = grid.hdr.rows[i].childNodes[j];
				if (!spans[i][j])
					spans[i][j]=[0,0];
				if (cell)
					spans[i][cell._cellIndexS]=[cell.colSpan, cell.rowSpan];
			}
		}
		
	    var xml = "<rows profile='"+profile+"'";
	       if (header)
	          xml+=" header='"+header+"'";
	       if (footer)
	          xml+=" footer='"+footer+"'";
	    xml+="><head>"+grid._serialiseExportConfig(spans).replace(/^<head/,"<columns").replace(/head>$/,"columns>");
	    for (var i=2; i < grid.hdr.rows.length; i++) {
                var empty_cols = 0;
                var row = grid.hdr.rows[i];
    	        var cxml="";
	    	for (var j=0; j < grid._cCount; j++) {
	    		if ((grid._srClmn && !grid._srClmn[j]) || (grid._hrrar[j] && ( !grid._fake || j >= grid._fake.hdrLabels.length))) {
	    			empty_cols++;
	    			continue;
    			}
	    		var s = spans[i][j];
	    		var rspan =  (( s[0] && s[0] > 1 ) ? ' colspan="'+s[0]+'" ' : "");
                        if (s[1] && s[1] > 1){
                             rspan+=' rowspan="'+s[1]+'" ';
                             empty_cols = -1;
                        }
                        
                
                var val = "";
                //split mode
                var frow = row;
                if (grid._fake && j < grid._fake._cCount)
                	frow = grid._fake.hdr.rows[i];

                for (var k=0; k<frow.cells.length; k++){
					if (frow.cells[k]._cellIndexS==j) {
						if (frow.cells[k].getElementsByTagName("SELECT").length)
							val="";
						else
							val = _isIE?frow.cells[k].innerText:frow.cells[k].textContent;
							val=val.replace(/[ \n\r\t\xA0]+/," ");
						break;
					}
				}
	    		if (!val || val==" ") empty_cols++;
	    		cxml+="<column"+rspan+"><![CDATA["+val+"]]></column>";
	    	};
	    	if (empty_cols != grid._cCount)
	    		xml+="\n<columns>"+cxml+"</columns>";
	    };
	    xml+="</head>\n";
	    xml+=xml_footer();
	    return xml;
	};
	
	function xml_body() {
		var xml =[];
	    if (rows)
	    	for (var i=0; i<rows.length; i++)
	    		xml.push(xml_row(grid.getRowIndex(rows[i])));
	    else
	    	for (var i=0; i<grid.getRowsNum(); i++)
	    		xml.push(xml_row(i));
	    return xml.join("\n");
	}
	function xml_footer() {
		var xml =["<foot>"];
		if (!grid.ftr) return "";
		for (var i=1; i < grid.ftr.rows.length; i++) {
			xml.push("<columns>");
			var row = grid.ftr.rows[i];
			for (var j=0; j < grid._cCount; j++){
				if (grid._srClmn && !grid._srClmn[j]) continue;
				if (grid._hrrar[j] && ( !grid._fake || j >= grid._fake.hdrLabels.length)) continue;
				for (var k=0; k<row.cells.length; k++){
				 	var val = "";
				 	var span = "";
					if (row.cells[k]._cellIndexS==j) {
						val = _isIE?row.cells[k].innerText:row.cells[k].textContent;
						val=val.replace(/[ \n\r\t\xA0]+/," ");
						
						if (row.cells[k].colSpan && row.cells[k].colSpan!=1)
							span = " colspan='"+row.cells[k].colSpan+"' ";
						
						if (row.cells[k].rowSpan && row.cells[k].rowSpan!=1)
							span = " rowspan='"+row.cells[k].rowSpan+"' ";
						break;
					}
				}
				xml.push("<column"+span+"><![CDATA["+val+"]]></column>");
			}
			xml.push("</columns>");
		};
		xml.push("</foot>");
	    return xml.join("\n");
	};
	function get_style(node, style){
		return (window.getComputedStyle?(window.getComputedStyle(node, null)[style]):(node.currentStyle?node.currentStyle[style]:null))||"";
	};
	
	function xml_row(ind){
		if (!grid.rowsBuffer[ind]) return "";
		var r = grid.render_row(ind);
		if (r.style.display=="none") return "";
		var level = grid.isTreeGrid() ? ' level="' + grid.getLevel(r.idd) + '"' : '';
		var xml = "<row" + level + ">";
		for (var i=0; i < grid._cCount; i++) {
			if (((!grid._srClmn)||(grid._srClmn[i]))&&(!grid._hrrar[i] || ( grid._fake && i < grid._fake.hdrLabels.length))){
				var cell = grid.cells(r.idd, i);
				if (full_color){
					var text_color	= get_style(cell.cell,"color");
		        	var bg_color	= get_style(cell.cell,"backgroundColor");
					var bold		= get_style(cell.cell, "font-weight") || get_style(cell.cell, "fontWeight");
					var italic		= get_style(cell.cell, "font-style") || get_style(cell.cell, "fontStyle");
					var align		= get_style(cell.cell, "text-align") || get_style(cell.cell, "textAlign");
					var font	 = get_style(cell.cell, "font-family") || get_style(cell.cell, "fontFamily");
		        	if (bg_color == "transparent" || bg_color == "rgba(0, 0, 0, 0)") bg_color = "rgb(255,255,255)";
		        	xml+="<cell bgColor='"+bg_color+"' textColor='" + text_color + "' bold='" + bold + "' italic='" + italic + "' align='"+align+"' font='" + font + "'>";
				} else 
					xml+="<cell>";
				
				xml+="<![CDATA["+(cell.getContent?cell.getContent():cell.getTitle())+"]]></cell>";
			}
		};
		return xml+"</row>";
	}
	function xml_end(){
	    var xml = "</rows>";
	    return xml;
	}


			
	var d=document.createElement("div");
	d.style.display="none";
	document.body.appendChild(d);
	var uid = "form_"+grid.uid();

	d.innerHTML = '<form id="'+uid+'" method="post" action="'+url+'" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded"' + this.target + '><input type="hidden" name="grid_xml" id="grid_xml"/> </form>';
	document.getElementById(uid).firstChild.value = encodeURIComponent(xml_top(mode).replace("\u2013", "-") + xml_body() + xml_end());
	document.getElementById(uid).submit();
	d.parentNode.removeChild(d);


	grid = null;
	
	if (save_sel && save_sel.row.length) {
		for (var i = 0; i < save_sel.row.length; i++) {
			save_sel.row[i].parentNode.className += ' rowselected';
			if (save_sel.row.length == 1)
				save_sel.row[i].className += ' cellselected';
		}
	};
	save_sel = null;
};
dhtmlXGridObject.prototype._serialiseExportConfig=function(spans){
	function xmlentities(str) {
		if (typeof(str)!=='string') return str;
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&apos;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		return str;
	}
	
	var out = "<head>";

	for (var i = 0; i < this.hdr.rows[0].cells.length; i++){
		if (this._srClmn && !this._srClmn[i]) continue;
		if (this._hrrar[i] && ( !this._fake || i >= this._fake.hdrLabels.length)) continue;
		var sort = this.fldSort[i];
		if (sort == "cus"){
			sort = this._customSorts[i].toString();
			sort=sort.replace(/function[\ ]*/,"").replace(/\([^\f]*/,"");
		}
		var s = spans[1][i];
		var rpans = (( s[1] && s[1] > 1 ) ? ' rowspan="'+s[1]+'" ' : "")+(( s[0] && s[0] > 1 ) ? ' colspan="'+s[0]+'" ' : "");
		out+="<column "+rpans+" width='"+this.getColWidth(i)+"' align='"+this.cellAlign[i]+"' type='"+this.cellType[i] + "' hidden='" + ((this.isColumnHidden && this.isColumnHidden(i)) ? 'true' : 'false')
			+"' sort='"+(sort||"na")+"' color='"+(this.columnColor[i]||"")+"'"
			+(this.columnIds[i]
				? (" id='"+this.columnIds[i]+"'")
				: "")+">";
		if (this._asCDATA)
			out+="<![CDATA["+this.getColumnLabel(i)+"]]>";
		else
			out+=this.getColumnLabel(i);
		var z = this.combos[i]?this.getCombo(i):null;

		if (z)
			for (var j = 0; j < z.keys.length; j++)out+="<option value='"+xmlentities(z.keys[j])+"'><![CDATA["+z.values[j]+"]]></option>";
		out+="</column>";
	}
	return out+="</head>";
};
if (window.eXcell_sub_row_grid)
	window.eXcell_sub_row_grid.prototype.getContent=function(){ return ""; };


dhtmlXGridObject.prototype.toExcel = function(url,mode,header,footer,rows) {
	if (!document.getElementById('ifr')) {
		var ifr = document.createElement('iframe');
		ifr.style.display = 'none';
		ifr.setAttribute('name', 'dhx_export_iframe');
		ifr.setAttribute('src', '');
		ifr.setAttribute('id', 'dhx_export_iframe');
		document.body.appendChild(ifr);
	}

	var target = " target=\"dhx_export_iframe\"";
	this.toPDF(url,mode,header,footer,rows,target);
}

/**
*   @desc: start fast operation mode, in such mode events are not generated, some time consuming actions applied only once, which allow to increase performance
*   @type: public
*   @topic: 0
*/   
dhtmlXGridObject.prototype.startFastOperations   =    function(){
	this._disF=["setSizes","callEvent","_fixAlterCss","cells4","forEachRow", "_correctMonolite"];
   	this._disA=[];
   	for (var i = this._disF.length - 1; i >= 0; i--){
   		this._disA[i]=this[this._disF[i]]; this[this._disF[i]]=function(){return true};
   	};
   		
   	this._cellCache=[];
   	this.cells4=function(cell){
   		var c=this._cellCache[cell._cellIndex]
   		if (!c){
   			c=this._cellCache[cell._cellIndex]=this._disA[3].apply(this,[cell]);
			c.destructor=function(){return true;}
   			c.setCValue=function(val){c.cell.innerHTML=val;}
   		}
   			
   		c.cell=cell;
   		c.combo=cell._combo||this.combos[cell._cellIndex];
   		return c;
   	}
   		
}
/**
*   @desc: turn off fast operation mode, need to be executed to normalize view.
*   @type: public
*   @topic: 0
*/      
dhtmlXGridObject.prototype.stopFastOperations   =    function(){
	if (!this._disF) return;
	for (var i = this._disF.length - 1; i >= 0; i--){
		this[this._disF[i]]=this._disA[i];
	};

	if (this._correctMonolite)  		
		this._correctMonolite();
		this.setSizes();
		this.callEvent("onGridReconstructed",[]);
}

dhtmlXGridObject.prototype._in_header_number_filter=function(t,i){
	this._in_header_text_filter.call(this,t,i);
	var self = this;
	t.firstChild._filter=function(){
		var filters = self._get_filters(this.value, 'num');
		return function(value) {
			var result = filters.length > 0 ? false : true;
			for (var i = 0; i < filters.length; i++)
				result = result || filters[i](value);
			return result;
		}
	};
}


dhtmlXGridObject.prototype._in_header_string_filter=function(t,i){
	this._in_header_text_filter.call(this,t,i);
	var self = this;
	t.firstChild._filter=function(){
		var filters = self._get_filters(this.value, 'str');
		return function(value) {
			var result = filters.length > 0 ? false : true;
			for (var i = 0; i < filters.length; i++)
				result = result || filters[i](value);
			return result;
		}
	};
}


dhtmlXGridObject.prototype._get_filters=function(value, type) {
	var fs = value.split(',');
	var filters = [];
	
	for (var i = 0; i < fs.length; i++) {
		if (fs[i] == '') continue;
		var f = this['_get_' + type + '_filter'](fs[i]);
		filters.push(f);
	}
	return filters;
}


dhtmlXGridObject.prototype._get_str_filter=function(value) {
	// empty, null
	if (value == 'null' || value == 'empty') {
		return new Function('value', 'if (value == null || value == "") return true; return false;');
	}
	
	// not empty, not null
	if (value == '!null' || value == '!empty') {
		return new Function('value', 'if (value == null || value == "") return false; return true;');
	}
	// not equals
	if (value.substr(0, 1) === '!') {
		var substr = value.substr(1);
		return new Function('value', 'if (value !== "' + substr + '") return true; return false;');
	}
	// contains
	if (value.substr(0, 1) === '~') {
		var substr = value.substr(1);
		return new Function('value', 'if (value.indexOf("' + substr + '") !== -1) return true; return false;');
	}
	// ^keyword& 
	if (value.substr(0, 1) === '^' && value.substr(value.length - 1, 1) === '&') {
		value = '=' + value.substr(1, value.length - 2);
	}
	// start with
	if (value.substr(0, 1) === '^') {
		var substr = value.substr(1);
		return new Function('value', 'if (value.substr(0, ' + substr.length + ') === "' + substr + '") return true; return false;');
	}
	// end with
	if (value.substr(value.length - 1, 1) === '&') {
		var substr = value.substr(0, value.length - 1);
		return new Function('value', 'if (value.substr(value.length - ' + substr.length + ') === "' + substr + '") return true; return false;');
	}
	// equals
	if (value.substr(0, 1) === '=')
		var substr = value.substr(1);
	else
		var substr = value;
	return new Function('value', 'if (value === "' + substr + '") return true; return false;');
}


dhtmlXGridObject.prototype._get_num_filter=function(value) {
	// empty, null
	if (value == 'null' || value == 'empty') {
		return new Function('value', 'if (value == null || value == "") return true; return false;');
	}

	// not empty, not null
	if (value == '!null' || value == '!empty') {
		return new Function('value', 'if (value == null || value == "") return false; return true;');
	}
	// in range
	var range = value.split('..');
	if (range.length == 2) {
		var num1 = parseFloat(range[0]);
		var num2 = parseFloat(range[1]);
		return new Function('value', 'if (value >= ' + num1 + ' && value <= ' + num2 + ') return true; return false;');
	}
	var r = value.match(/<>|>=|<=|>|<|=/);
	if (r) {
		var op = r[0];
		var num = parseFloat(value.replace(op, ""));
	} else {
		var op = '==';
		num = parseFloat(value);
	}
	if (op == '<>') op = '!=';
	if (op == '=') op = '==';
	return new Function("value"," if (value " + op + " " + num + " ) return true; return false;");
}

/**
*   @desc: filter grid by mask
*   @type: public
*   @param: column - {number} zero based index of column
*   @param: value - {string} filtering mask
*   @param: preserve - {bool} filter current or initial state ( false by default )
*	@edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.filterBy=function(column, value, preserve){
	if (this.isTreeGrid()) return this.filterTreeBy(column, value, preserve);
	if (this._f_rowsBuffer){
		if (!preserve){
			this.rowsBuffer=dhtmlxArray([].concat(this._f_rowsBuffer));
			if (this._fake) this._fake.rowsBuffer=this.rowsBuffer;
		}
	} else
		this._f_rowsBuffer=[].concat(this.rowsBuffer);	//backup copy
	
		
	if (!this.rowsBuffer.length) return;
	var d=true;
	this.dma(true)
	if (typeof(column)=="object")
		for (var j=0; j<value.length; j++)
			this._filterA(column[j],value[j]);
	else
			this._filterA(column,value);
	this.dma(false)
	if (this.pagingOn && this.rowsBuffer.length/this.rowsBufferOutSize < (this.currentPage-1)) this.changePage(0);
	this._reset_view();
	this.callEvent("onGridReconstructed",[])
}
dhtmlXGridObject.prototype._filterA=function(column,value){ 
	if (value=="") return;
	var d=true;
	if (typeof(value)=="function") d=false;
	else value=(value||"").toString().toLowerCase();
	if (!this.rowsBuffer.length) return;
	
	for (var i=this.rowsBuffer.length-1; i>=0; i--)
		if (d?(this._get_cell_value(this.rowsBuffer[i],column).toString().toLowerCase().indexOf(value)==-1):(!value.call(this, this._get_cell_value(this.rowsBuffer[i],column),this.rowsBuffer[i].idd)))
			this.rowsBuffer.splice(i,1);//filter row
}

dhtmlXGridObject.prototype.getFilterElement=function(index){
	if (!this.filters) return;
	for (var i=0; i < this.filters.length; i++) {
		if (this.filters[i][1]==index)
			return (this.filters[i][0].combo||this.filters[i][0]);
	};
	return null;
}

/**
*   @desc: get all possible values in column
*   @type: public
*   @param: column - {number} zero based index of column
*   @returns: {array} array of all possible values in column
*	@edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.collectValues=function(column){
	var evs = this.dhxevs.data.oncollectvalues;
	if (evs){
		var value = true;
		for (var key in evs){
			var nextvalue = evs[key].call(this, column);
			if (nextvalue !== true) value = nextvalue || value;
		}
		if (value !== true)
			return value;
 	}
 	
	if (this.isTreeGrid()) return this.collectTreeValues(column);
	this.dma(true)
	this._build_m_order();
	column=this._m_order?this._m_order[column]:column;
	var c={}; var f=[];
	var col=this._f_rowsBuffer||this.rowsBuffer;
	for (var i=0; i<col.length; i++){
		var val=this._get_cell_value(col[i],column);
		if (val && (!col[i]._childIndexes || col[i]._childIndexes[column]!=col[i]._childIndexes[column-1])) c[val]=true;
	}
	this.dma(false);
	var vals= (this.combos[column]||(this._col_combos&&this._col_combos[column]?this._col_combos[column]:((this._sub_trees && this._sub_trees[column])?this._sub_trees[column][0]:false)));

	for (var d in c) 
		if (c[d]===true){
           if(vals){
               if(vals.get&&vals.get(d)){
                   d = vals.get(d);
               }
               else if(vals.getOption&&vals.getOption(d)){
                   d = vals.getOption(d).text;
               }
				else if(vals.getItemText){
                   var text = vals.getItemText(d);
                   var t = this._sub_trees[column][1] = this._sub_trees[column][1] || {};
                   t[text] = d;
                   d = text;
               }
           }
           f.push(d);
        }
	
	return f.sort();			
}

dhtmlXGridObject.prototype._build_m_order=function(){
	if (this._c_order){
		this._m_order=[]
		for (var i=0; i < this._c_order.length; i++) {
			this._m_order[this._c_order[i]]=i;
		};
	}
}
/**
*   @desc: force grid filtering by registered inputs ( created by # starting shortcuts, or by makeFilter function )
*   @type: public
*	@edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.filterByAll=function(){
	var a=[];
	var b=[];
	this._build_m_order();

	for (var i=0; i<this.filters.length; i++){
		var ind=this._m_order?this._m_order[this.filters[i][1]]:this.filters[i][1];
		if (ind >= this._cCount) continue;
		b.push(ind);

		var val=this.filters[i][0].old_value=this.filters[i][0].value;
		if (this.filters[i][0]._filter)
			val = this.filters[i][0]._filter();
		
		var vals;
		if (typeof val != "function" && (vals=(this.combos[ind]||((this._col_combos&&this._col_combos[ind])?this._col_combos[ind]:((this._sub_trees && this._sub_trees[ind])?this._sub_trees[ind][1]:false))))){
            if(vals.values){
                ind=vals.values._dhx_find(val);
			    val=(ind==-1)?val:vals.keys[ind];
            }
			else if(vals.getOptionByLabel){
                val=(vals.getOptionByLabel(val)?vals.getOptionByLabel(val).value:val);
            } else
            	val = vals[val];
		}
		a.push(val);
		
	}
	if (!this.callEvent("onFilterStart",[b,a])) return;

	this.filterBy(b,a);
	if (this._cssEven) this._fixAlterCss();
	this.callEvent("onFilterEnd",[this.filters]);

	if (this._f_rowsBuffer && this.rowsBuffer.length == this._f_rowsBuffer.length)
		this._f_rowsBuffer = null;
}

/**
*   @desc: create a filter from any input element (text filter), select (dropdown) or DIV (combobox based on dhtmlxCombo)
*   @type: public
*   @param: id - {string|object} input id or input html object
*   @param: column - {number} index of column
*   @param: preserve - {bool} filter current state or initial one ( false by default )
*	@edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.makeFilter=function(id,column,preserve){
	if (!this.filters) this.filters=[];
	if (typeof(id)!="object")
		id=document.getElementById(id);
	if(!id) return;
	var self=this;
	
	if (!id.style.width) id.style.width = "90%";
		
	if (id.tagName=='SELECT'){
		this.filters.push([id,column]);
		this._loadSelectOptins(id,column);
		id.onchange=function(){
			self.filterByAll();
		}
		if(_isIE)
			id.style.marginTop="1px";
			
		this.attachEvent("onEditCell",function(stage,a,ind){ 
			this._build_m_order();
			if (stage==2 && this.filters && ( this._m_order?(ind==this._m_order[column]):(ind==column) ))
				this._loadSelectOptins(id,column);
			return true;
		});
	} 
	else if (id.tagName=='INPUT'){
		this.filters.push([id,column]);
		id.old_value = id.value='';
		id.onkeydown=function(){
			if (this._timer) window.clearTimeout(this._timer);
			this._timer=window.setTimeout(function(){
				if (id.value != id.old_value){
					self.filterByAll();
					id.old_value=id.value;
				}
			},500);
		};
	}
	else if (id.tagName=='DIV'){
		this.filters.push([id,column]);
		id.style.padding="0px";id.style.margin="0px";
		if (!window.dhx_globalImgPath) window.dhx_globalImgPath=this.imgURL;
		var z=new dhtmlXCombo(id,"_filter","90%");
		z.filterSelfA=z.filterSelf;
		z.filterSelf=function(){
			if (this.getSelectedIndex()==0) this.setComboText("");
			this.filterSelfA.apply(this,arguments);
			this.optionsArr[0].hide(false);	
		}
         
         
		z.enableFilteringMode(true);
		id.combo=z;
		id.value="";
		
		this._loadComboOptins(id,column);
		z.attachEvent("onChange",function(){
			id.value=z.getSelectedValue();
			if (id.value === null) id.value = "";
			self.filterByAll();
		});
	}
	if (id.parentNode)
		id.parentNode.className+=" filter";
	
	this._filters_ready(); //set event handlers
}
	/**
	*   @desc: find cell in grid by value
	*   @param: value - search string
	*   @param: c_ind - index of column to search in (optional. if not specified, then search everywhere)
	*   @param: count - count of results to return
	*   @edition: Professional
	*   @returns: array each member of which contains array with row ID  and cell index
	*   @type:  public
	*/
	dhtmlXGridObject.prototype.findCell=function(value, c_ind, count, compare){ 
		var compare = compare || (function(master, check){
			return check.toString().toLowerCase().indexOf(master) != -1;
		});
		if (compare === true)
			compare = function(master, check){ return check.toString().toLowerCase() == master; };

		var res = new Array();
		value=value.toString().toLowerCase();
		if (typeof count != "number") count = count?1:0;
	
		if (!this.rowsBuffer.length)
			return res;
	
		for (var i = (c_ind||0); i < this._cCount; i++){
			if (this._h2)
				this._h2.forEachChild(0,function(el){
					if (count && res.length==count) return res;
					if (compare(value, this._get_cell_value(el.buff,i))){
						res.push([el.id,i]);
					}
				},this)
			else
				for (var j=0; j < this.rowsBuffer.length; j++) 
					if (compare(value, this._get_cell_value(this.rowsBuffer[j],i))){
						res.push([this.rowsBuffer[j].idd,i]);
						if (count && res.length==count) return res;
					}
						
			
		
			if (typeof (c_ind) != "undefined")
				return res;
		}
	
		return res;
	}
	
/**
*   @desc: create a search box (set selection to the row with found value) from any input
*   @type: public
*   @param: id - {string|object} input id or input html object
*   @param: column - {number} index of column
*	@edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.makeSearch=function(id,column,strict){
	if (typeof(id)!="object")
		id=document.getElementById(id);
	if(!id) return;
	var self=this;
		
	if (id.tagName=='INPUT'){
		id.onkeypress=function(){
			if (this._timer) window.clearTimeout(this._timer);
			this._timer=window.setTimeout(function(){
				if (id.value=="") return;
				var z=self.findCell(id.value,column,true,strict);
				if (z.length){
					if (self._h2)
						self.openItem(z[0][0]);
					self.selectCell(self.getRowIndex(z[0][0]),(column||0))
				}
			},500);
		};
	}
	if (id.parentNode)
		id.parentNode.className+=" filter";
}
	
dhtmlXGridObject.prototype._loadSelectOptins=function(t,c){ 
		var l=this.collectValues(c);
		var v=t.value;
		t.innerHTML="";
		t.options[0]=new Option("","");
		var f=this._filter_tr?this._filter_tr[c]:null;
		for (var i=0; i<l.length; i++)
			t.options[t.options.length]=new Option(f?f(l[i]):l[i],l[i]);
		t.value=v;
}
dhtmlXGridObject.prototype.setSelectFilterLabel=function(ind,fun){ 
		if (!this._filter_tr) this._filter_tr=[];
		this._filter_tr[ind]=fun;
}

dhtmlXGridObject.prototype._loadComboOptins=function(t,c){
	if (!t.combo) return; // prevent calls from refreshFilters
	var l=this.collectValues(c);
	t.combo.clearAll();
	var opts = [["",""]];	
	for (var i=0; i<l.length; i++) opts.push([l[i],l[i]]);
	t.combo.addOption(opts);
}

/**
*   @desc: refresh filtering ( can be used if data in grid changed and filters need to be updated )
*   @type: public
*	@edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.refreshFilters=function(){
        if(!this.filters) return;
	for (var i=0; i<this.filters.length; i++){
		switch(this.filters[i][0].tagName.toLowerCase()){
			case "input":
				/*HSITX*/
				if(this.filters[i][0].parentNode.classList.contains("xui-combo-label")){
					this._loadXuiComboFilter.apply(this, this.filters[i]);
				}
				/**/
				break;
			case "select":
				this._loadSelectOptins.apply(this,this.filters[i]);
				break;
		}
	}
}

dhtmlXGridObject.prototype._filters_ready=function(fl,code){
	this.attachEvent("onXLE",this.refreshFilters);
	this.attachEvent("onSyncApply",this.refreshFilters);
	this.attachEvent("onRowCreated",function(id,r){
		if (this._f_rowsBuffer)
			for (var i=0; i<this._f_rowsBuffer.length; i++)
				if (this._f_rowsBuffer[i].idd == id)
					return this._f_rowsBuffer[i]=r;
	})
	this.attachEvent("onClearAll",function(){ 
	    this._f_rowsBuffer=null; 
		if (!this.hdr.rows.length)
			this.filters=[];
	});
	/*
	if (window.dhtmlXCombo)
		this.attachEvent("onScroll",dhtmlXCombo.prototype.closeAll);
	*/
	this.attachEvent("onSetSizes", this._filters_resize_combo);
	this.attachEvent("onResize", this._filters_resize_combo);
	
	this._filters_ready=function(){};
}

dhtmlXGridObject.prototype._filters_resize_combo=function(){
	if (!this.filters) return;
	for (var q=0; q<this.filters.length; q++) {
		if (this.filters[q][0].combo != null) {
			this.filters[q][0].combo.setSize(Math.round(this.filters[q][0].offsetWidth*90/100));
		}
	}
	return true;
}

dhtmlXGridObject.prototype._in_header_text_filter=function(t,i){
	t.innerHTML="<input type='text'>";
	t.onclick=t.onmousedown = function(e){ (e||event).cancelBubble=true; return true; }
	t.onselectstart=function(){ return (event.cancelBubble=true); }
	this.makeFilter(t.firstChild,i);
}

dhtmlXGridObject.prototype._in_header_text_filter_inc=function(t,i){
	t.innerHTML="<input type='text'>";
	t.onclick=t.onmousedown = function(e){ (e||event).cancelBubble=true; return true; }
	t.onselectstart=function(){ return (event.cancelBubble=true); }
	this.makeFilter(t.firstChild,i);
	t.firstChild._filter=function(){ 
		if (t.firstChild.value=="") return "";
		return function(val){
			return (val.toString().toLowerCase().indexOf(t.firstChild.value.toLowerCase())==0); 
		}
	}
	this._filters_ready();
}

dhtmlXGridObject.prototype._in_header_select_filter=function(t,i){
	t.innerHTML="<select></select>";
	t.onclick=function(e){ (e||event).cancelBubble=true; return false; }
	this.makeFilter(t.firstChild,i);
}

dhtmlXGridObject.prototype._in_header_select_filter_strict=function(t,i){
	t.innerHTML="<select style='width:90%; font-size:8pt; font-family:Tahoma;'></select>";
	t.onclick=function(e){ (e||event).cancelBubble=true; return false; }
	this.makeFilter(t.firstChild,i);
	var combos = this.combos;
	t.firstChild._filter=function(){ 
		var value = t.firstChild.value;
		if (!value) return "";
		if (combos[i])
            value = combos[i].keys[combos[i].values._dhx_find(value)];
       	value = value.toLowerCase();
            
		return function(val){
			return (val.toString().toLowerCase()==value); 
		};
	};
	this._filters_ready();
}

dhtmlXGridObject.prototype._in_header_combo_filter=function(t,i){
	t.innerHTML="<div style='width:100%; padding-left:2px; overflow:hidden; ' class='combo'></div>";
	t.onselectstart=function(){ return (event.cancelBubble=true); }
	t.onclick=t.onmousedown=function(e){ (e||event).cancelBubble=true; return true; }
	this.makeFilter(t.firstChild,i);
}

dhtmlXGridObject.prototype._search_common=function(t, i){
	t.innerHTML="<input type='text' style='width:90%; '>";
	t.onclick= t.onmousedown = function(e){ (e||event).cancelBubble=true; return true; }
	t.onselectstart=function(){ return (event.cancelBubble=true); }
}
dhtmlXGridObject.prototype._in_header_text_search=function(t,i, strict){
	this._search_common(t, i);
	this.makeSearch(t.firstChild,i);
}
dhtmlXGridObject.prototype._in_header_text_search_strict=function(t,i){
	this._search_common(t, i);
	this.makeSearch(t.firstChild,i, true);
}

dhtmlXGridObject.prototype._in_header_numeric_filter=function(t,i){
	this._in_header_text_filter.call(this,t,i);
	t.firstChild._filter=function(){
		var v=this.value;
		
		var r; var op="=="; var num=parseFloat(v.replace("=","")); var num2=null;
		
		if (v){
			if (v.indexOf("..")!=-1){
				v=v.split("..");
				num=parseFloat(v[0]);
				num2=parseFloat(v[1]);
				return function(v){
					if (v>=num && v<=num2) return true;
					return false;
					}
			}
			r=v.match(/>=|<=|>|</)
			if (r) {
				op=r[0];
				num=parseFloat(v.replace(op,""));
			}
			return Function("v"," if (v "+op+" "+num+" ) return true; return false;");
		}
		return "";
	};
}

dhtmlXGridObject.prototype._in_header_master_checkbox=function(t,i,c){
	t.innerHTML=c[0]+"<input type='checkbox' />"+c[1];
	var self=this;
	t.getElementsByTagName("input")[0].onclick=function(e){
		self._build_m_order();
		var j=self._m_order?self._m_order[i]:i;
		var val=this.checked?1:0;
		self.forEachRowA(function(id){
			var c=this.cells(id,j);
			if (c.isCheckbox() && !c.isDisabled()) {
				c.setValue(val);
				c.cell.wasChanged = true;
			}
			this.callEvent("onEditCell",[1,id,j,val]);
			this.callEvent("onCheckbox", [id, j, val]);
			this.callEvent("onCheck", [id, j, val]);
		});
		(e||event).cancelBubble=true;
	}
}

dhtmlXGridObject.prototype._in_header_stat_total=function(t,i,c){
	var calck=function(){
		var summ=0;
		this._build_m_order();
		var ii = this._m_order?this._m_order[i]:i;
		for (var j=0; j<this.rowsBuffer.length; j++){
			var v=parseFloat(this._get_cell_value(this.rowsBuffer[j],ii));
			summ+=isNaN(v)?0:v;
		}
		
		return this._maskArr[ii]?this._aplNF(summ,ii):(Math.round(summ*100)/100);
	}
	this._stat_in_header(t,calck,i,c,c);
}
dhtmlXGridObject.prototype._in_header_stat_multi_total=function(t,i,c){
	var cols=c[1].split(":"); c[1]="";
	for(var k = 0; k < cols.length;k++){
		cols[k]=parseInt(cols[k]);
	}
	var calck=function(){
		var summ=0;
		for (var j=0; j<this.rowsBuffer.length; j++){
			var v = 1;
			for(var k = 0; k < cols.length;k++){
				v *= parseFloat(this._get_cell_value(this.rowsBuffer[j],cols[k]))
			}
			summ+=isNaN(v)?0:v;
		}
		return this._maskArr[i]?this._aplNF(summ,i):(Math.round(summ*100)/100);
	}
	var track=[];
	for(var ind = 0; ind < cols.length;ind++){
		track[cols[ind]]=true;
	}
	this._stat_in_header(t,calck,track,c,c);
}
dhtmlXGridObject.prototype._in_header_stat_max=function(t,i,c){
	var calck=function(){
		this._build_m_order();
		var ii = this._m_order?this._m_order[i]:i;
		
		var summ=-999999999;
		if (this.getRowsNum()==0) return "&nbsp;";
		for (var j=0; j<this.rowsBuffer.length; j++)
			summ=Math.max(summ,parseFloat(this._get_cell_value(this.rowsBuffer[j],ii)));
		
		return this._maskArr[i]?this._aplNF(summ,i):summ;
	}
	this._stat_in_header(t,calck,i,c);
}
dhtmlXGridObject.prototype._in_header_stat_min=function(t,i,c){
	var calck=function(){
		this._build_m_order();
		var ii = this._m_order?this._m_order[i]:i;
		
		var summ=999999999;
		if (this.getRowsNum()==0) return "&nbsp;";
		for (var j=0; j<this.rowsBuffer.length; j++)
			summ=Math.min(summ,parseFloat(this._get_cell_value(this.rowsBuffer[j],ii)));
		return this._maskArr[i]?this._aplNF(summ,i):summ;
	}
	this._stat_in_header(t,calck,i,c);
}
dhtmlXGridObject.prototype._in_header_stat_average=function(t,i,c){
	var calck=function(){
		this._build_m_order();
		var ii = this._m_order?this._m_order[i]:i;
		
		var summ=0; var count=0;
		if (this.getRowsNum()==0) return "&nbsp;";
		for (var j=0; j<this.rowsBuffer.length; j++){
			var v=parseFloat(this._get_cell_value(this.rowsBuffer[j],ii));
			if (!isNaN(v)){
				summ+=v;
				count++;
			}
		}
		return this._maskArr[i]?this._aplNF(summ/count,i):(Math.round(summ/count*100)/100);
	}
	this._stat_in_header(t,calck,i,c);
}
dhtmlXGridObject.prototype._in_header_stat_count=function(t,i,c){
	var calck=function(){
		return this.getRowsNum();
	}
	this._stat_in_header(t,calck,i,c);
}

dhtmlXGridObject.prototype._stat_in_header=function(t,calck,i,c){
	var that=this;
	var f=function(){
		this.dma(true)
		t.innerHTML=(c[0]?c[0]:"")+calck.call(this)+(c[1]?c[1]:"");
		this.dma(false)
		this.callEvent("onStatReady",[])
	}
	if (!this._stat_events) {
		this._stat_events=[];
		this.attachEvent("onClearAll",function(){ 
			if (!this.hdr.rows[1]){
				for (var i=0; i<this._stat_events.length; i++)
					for (var j=0; j < 4; j++) 
						this.detachEvent(this._stat_events[i][j]);
				this._stat_events=[];	
			}
		})
	}
	
	this._stat_events.push([
	this.attachEvent("onGridReconstructed",f),
	this.attachEvent("onXLE",f),
	this.attachEvent("onFilterEnd",f),
	this.attachEvent("onEditCell",function(stage,id,ind){
		if (stage==2 && ( ind==i || ( i && i[ind]) ) ) f.call(this);
		return true;
		})]);
	t.innerHTML="";
}

dhtmlXGridObject.prototype.attachHeaderA=dhtmlXGridObject.prototype.attachHeader;
dhtmlXGridObject.prototype.attachHeader=function()
{
	this.attachHeaderA.apply(this,arguments);
	if (this._realfake) return true;
	this.formAutoSubmit();
	if (typeof(this.FormSubmitOnlyChanged)=="undefined")
		this.submitOnlyChanged(true);
		
	if (typeof(this._submitAR)=="undefined")
		this.submitAddedRows(true);
		
	var that=this;
	
	this._added_rows=[];
	this._deleted_rows=[];
	
	this.attachEvent("onRowAdded",function(id){ 
		that._added_rows.push(id);
		that.forEachCell(id,function(a){ a.cell.wasChanged=true; })
		return true;
	});
	this.attachEvent("onBeforeRowDeleted",function(id){
		that._deleted_rows.push(id);
		return true;
	});
	
	this.attachHeader=this.attachHeaderA;
}

dhtmlXGridObject.prototype.formAutoSubmit = function()
{
	this.parentForm = this.detectParentFormPresent();
	if (this.parentForm === false) {
		return false;
	}
	if (this.formEventAttached)
		return;
    this.formInputs = new Array();
	var self = this;
	dhtmlxEvent(this.parentForm, 'submit', function() {if (self.entBox) self.parentFormOnSubmit();});
	this.formEventAttached = true;
}

dhtmlXGridObject.prototype.parentFormOnSubmit = function()
{
	this.formCreateInputCollection();
	if (!this.callEvent("onBeforeFormSubmit",[])) return false;
}

/**
*   @desc: include only changed rows in form submit
*   @type: public
*   @param: mode - {boolean}  enable|disable mode
*   @topic: 0
*/
dhtmlXGridObject.prototype.submitOnlyChanged = function(mode)
{
	this.FormSubmitOnlyChanged = dhx4.s2b(mode);
}

dhtmlXGridObject.prototype.submitColumns=function(names){
	if (typeof names == "string") names=names.split(this.delim);
	this._submit_cols=names;	
}

/**
*   @desc: allows to define input name which will be used for data sending, name may contain next auto-replaced elements - GRID_ID - ID of grids container, ROW_ID - ID of row, ROW_INDEX - index of row, COLUMN_ID - id of column, COLUMN_INDEX - index of column
*   @type: public
*   @param: name - input name mask
*   @topic: 0
*/
dhtmlXGridObject.prototype.setFieldName=function(mask){
	mask=mask.replace(/\{GRID_ID\}/g,"'+a1+'");
	mask=mask.replace(/\{ROW_ID\}/g,"'+a2+'");
	mask=mask.replace(/\{ROW_INDEX\}/g,"'+this.getRowIndex(a2)+'");
	mask=mask.replace(/\{COLUMN_INDEX\}/g,"'+a3+'");
	mask=mask.replace(/\{COLUMN_ID\}/g,"'+this.getColumnId(a3)+'");
	this._input_mask=Function("a1","a2","a3","return '"+mask+"';");
}
 
   
/**
*   @desc: include serialized grid as part of form submit
*   @type: public
*   @param: mode - {boolean}  enable|disable mode
*   @topic: 0
*/
dhtmlXGridObject.prototype.submitSerialization = function(mode)
{
	this.FormSubmitSerialization = dhx4.s2b(mode);
}

/**
*   @desc: include additional data with info about which rows was added and which deleted, enabled by default
*   @type: public
*   @param: mode - {boolean}  enable|disable mode
*   @topic: 0
*/
dhtmlXGridObject.prototype.submitAddedRows = function(mode)
{
	this._submitAR = dhx4.s2b(mode);
}




/**
*   @desc: include only selected rows in form submit
*   @type: public
*   @param: mode - {boolean}  enable|disable mode
*   @topic: 0
*/
dhtmlXGridObject.prototype.submitOnlySelected = function(mode)
{
	this.FormSubmitOnlySelected = dhx4.s2b(mode);
}


/**
*   @desc: include only  row's IDS in form submit
*   @type: public
*   @param: mode - {boolean}  enable|disable mode
*   @topic: 0
*/
dhtmlXGridObject.prototype.submitOnlyRowID = function(mode)
{
	this.FormSubmitOnlyRowID = dhx4.s2b(mode);
}


dhtmlXGridObject.prototype.createFormInput = function(name,value){
    var input = document.createElement('input');
    input.type = 'hidden';
    if (this._input_mask && (typeof name != "string"))
    	input.name=this._input_mask.apply(this,name);
    else
    	input.name =((this.globalBox||this.entBox).id||'dhtmlXGrid')+'_'+name;
    input.value = value;
    this.parentForm.appendChild(input);
    this.formInputs.push(input);
}

dhtmlXGridObject.prototype.createFormInputRow = function(r){ 
	var id=(this.globalBox||this.entBox).id;
	for (var j=0; j<this._cCount; j++){
		var foo_cell = this.cells3(r, j);
		if (((!this.FormSubmitOnlyChanged) || foo_cell.wasChanged()) && (!this._submit_cols || this._submit_cols[j]))
			this.createFormInput(this._input_mask?[id,r.idd,j]:(r.idd+'_'+j),foo_cell.getValue());
	}
}


dhtmlXGridObject.prototype.formCreateInputCollection = function()
{
	if (this.parentForm == false) {
		return false;
	}
	for (var i=0; i<this.formInputs.length; i++) {
		this.parentForm.removeChild(this.formInputs[i]);
	}
    this.formInputs = new Array();
    
    if (this.FormSubmitSerialization){
    	this.createFormInput("serialized",this.serialize());
    } else if (this.FormSubmitOnlySelected){
    	//submit selected
    	if (this.FormSubmitOnlyRowID)
    		this.createFormInput("selected",this.getSelectedId());
    	else
    		for(var i=0;i<this.selectedRows.length;i++)
    			this.createFormInputRow(this.selectedRows[i]);
    	}
    else{
    	//submit all
    		if (this._submitAR){
    			if (this._added_rows.length)
    				this.createFormInput("rowsadded",this._added_rows.join(","));
    			if (this._deleted_rows.length)
    				this.createFormInput("rowsdeleted",this._deleted_rows.join(","));
	    		}
    		this.forEachRow(function(id){
    			 if (this.getRowById(id) !== -1)
    				this.createFormInputRow(this.rowsAr[id]);
			})
    		
    	}
}

dhtmlXGridObject.prototype.detectParentFormPresent = function()
{
	var parentForm = false;
	var parent = this.entBox;
	while(parent && parent.tagName && parent != document.body) {
		if (parent.tagName.toLowerCase() == 'form') {
			parentForm = parent;
			break;
		} else {
        	parent = parent.parentNode;
		}
	}
	return parentForm;
}

dhtmlXGridObject.prototype.unGroup=function(){ 
	if (!this._groups) return;
	this._dndProblematic=false;
	
	delete this._groups;
	delete this._gIndex;	
	if (this._fake)	this._mirror_rowsCol();
	this.forEachRow(function(id){
		this.rowsAr[id].style.display='';
	})
	this._reset_view();
	this.callEvent("onGridReconstructed",[])
	this.callEvent("onUnGroup",[]);
}

dhtmlXGridObject.prototype._mirror_rowsCol=function(){ 
	this._fake._groups=this._groups;
	this._fake._gIndex=this._gIndex;
	this.rowsBuffer=dhtmlxArray(); 
	for (var i=0; i<this.rowsCol.length; i++)
		if (!this.rowsCol[i]._cntr)
			this.rowsBuffer.push(this.rowsCol[i]);
	this._fake.rowsBuffer=dhtmlxArray(); 
	for (var i=0; i<this._fake.rowsCol.length; i++)
		if (!this._fake.rowsCol[i]._cntr)
			this._fake.rowsBuffer.push(this._fake.rowsCol[i]);
}
/**
*	@desc: group grid content by values of specified column
*	@param: ind - column index to group by
*	@edition: Professional
*	@type: public
*/
dhtmlXGridObject.prototype.groupBy=function(ind,mask){
		
	if (this._groups) this.unGroup();
	this._dndProblematic=true;
	this._groups={};
	if (!mask) {
		mask=["#title"];
		for (var i=1; i<this._cCount; i++) mask.push("#cspan");
	}
	this._gmask=document.createElement("TR");
	this._gmask.origin = mask;
	var ltd,rindex=0;
	for (var i=0; i<mask.length; i++){
		if (mask[i]=="#cspan") 
			ltd.colSpan=(parseInt(ltd.colSpan)||1)+1
		else {
			ltd=document.createElement("TD");
			ltd._cellIndex=i;
			if (this._hrrar[i]) ltd.style.display="none";
			ltd.className="group_row";
			ltd.innerHTML="&nbsp;";
			if (mask[i]=="#title") this._gmask._title=rindex;
			else ltd.align=this.cellAlign[i]||"left";
			this._gmask.appendChild(ltd);
			if (mask[i].indexOf("#stat")==0){
				this._gmask._math=true;
				ltd._counter=[this["_g_"+mask[i].replace("#","")],i,rindex];
			}
			rindex++;
		}
	}
	for (var a in this._groups) this._groups[a]=this.undefined;
	this._gIndex=ind;
	
	if (this._fake &&!this._realfake){
		this._fake._groups=[];
		this._fake._gIndex=this._gIndex;
	}
	
	//keyboard commands
	this._nextRow=function(ind,dir){
		var r=this.rowsCol[ind+dir];
		if (r && ( r.style.display=="none" || r._cntr)) return this._nextRow(ind+dir,dir);
		return r;	
	}
	
	if (!this.__sortRowsBG){
		this._key_events=dhtmlx.extend({},this._key_events)
		this._key_events.k38_0_0=function(){
			if (this.editor && this.editor.combo)
				this.editor.shiftPrev();
			else{
				var rowInd = this.row.rowIndex;
				if (!rowInd) return;
				var nrow=this._nextRow(rowInd-1,-1);
				if (nrow)
	        		this.selectCell(nrow,this.cell._cellIndex,true);
			}
		}
		this._key_events.k13_1_0=this._key_events.k13_0_1=function(){};
	this._key_events.k40_0_0=function(){
		if (this.editor && this.editor.combo)
			this.editor.shiftNext();
		else{
			var rowInd = this.row.rowIndex;
			if (!rowInd) return;
			var nrow=this._nextRow(rowInd-1,1);
			if (nrow)
        		this.selectCell(nrow,this.cell._cellIndex,true);
		}
	}	
	
		this.attachEvent("onFilterStart",function(){
			if (this._groups) this._groups=this.undefined;
			return true;
		});
		this.attachEvent("onFilterEnd",function(){
			if (typeof this._gIndex != "undefined") this.groupBy(this._gIndex,this._gmask.origin);
		});
		this.sortRows_bg=this.sortRows;
		this.sortRows=function(ind,type,dir){
			if (typeof(this._groups)=="undefined") 
				return this.sortRows_bg.apply(this,arguments);

			type = type || this.fldSort[ind] || "str";
			dir = dir || "asc";
			if (this.callEvent("onBeforeSorting",[ind, type, dir])){
				if (typeof(this._groups)=="undefined") return true;
				if (ind==this._gIndex) this._sortByGroup(ind,type,dir);
				else this._sortInGroup(ind,type,dir);
				this.setSortImgState(true,ind,dir)
				if (this._fake){ 
					this._mirror_rowsCol();
					this._fake._groups=[];
					this._fake._reset_view();
				}
				this.setSortImgState(true,ind,dir);
				this.callEvent("onAfterSorting",[ind,type,dir]);
			}
			return false;
		};
		this.attachEvent("onClearAll",function(){ this.unGroup(); });
		this.attachEvent("onBeforeRowDeleted",function(id){ 
			if (!this._groups) return true;
			if (!this.rowsAr[id]) return true;
			var val=this.cells(id,this._gIndex).getValue();
			if (val==="") val=" ";
			var z=this._groups[val];
			this._dec_group(z);
			return true;
			});
		this.attachEvent("onAfterRowDeleted",function(id){ 
			this.updateGroups();
			});			
		this.attachEvent("onCheckbox",function(id,index,value){
			this.callEvent("onEditCell",[2,id,index,(value?1:0),(value?0:1)]);
		});
		this.attachEvent("onXLE",this.updateGroups);
		this.attachEvent("onColumnHidden",this.hideGroupColumn);
		this.attachEvent("onEditCell",function(stage,id,ind,val,oldval){
			if (!this._groups) return true;
			if (stage==2 && val!=oldval && ind==this._gIndex){
				if (oldval==="") oldval=" ";
				this._dec_group(this._groups[oldval]);
				var r=this.rowsAr[id];
				var i=this.rowsCol._dhx_find(r)
				var ni=this._inc_group(val);
				var n=this.rowsCol[ni];
				if (r==n) n=n.nextSibling;
					
				
				var p=r.parentNode;
				var o=r.rowIndex;
				
				p.removeChild(r);
				if (n)
					p.insertBefore(r,n);
				else
					p.appendChild(r);
				this.rowsCol._dhx_insertAt(ni,r);
				if (ni<i) i++;
				this.rowsCol._dhx_removeAt(i,r);
				this._fixAlterCss();
			} else if (stage==2 && val!=oldval) {
				this.updateGroups();
				this._updateGroupView(this._groups[this.cells(id,this._gIndex).getValue()||" "]);
				}
			return true;
			})
		this.__sortRowsBG=true;
	}
	
	
	this._groupExisting();	
	if (this._hrrar)
		for (var i=0; i<this._hrrar.length; i++)
			if (this._hrrar[i])
				this.hideGroupColumn(i,true);
	this.callEvent("onGroup",[]);
	if (this._ahgr || this._awdth) this.setSizes();
}
dhtmlXGridObject.prototype._sortInGroup=function(col,type,order){
	var b=this._groups_get();
	b.reverse();

	for (var i=0; i<b.length; i++){
		var c=b[i]._cntr._childs; var a={};
		for (var j=0; j<c.length; j++){
			var cell = this.cells3(c[j],col);
			a[c[j].idd]=cell.getDate?cell.getDate():cell.getValue();
		}
			
		this._sortCore(col,type,order,a,c);
	}
	//add|delete|edit|ungroup
	this._groups_put(b);
	this.setSizes();
	this.callEvent("onGridReconstructed",[])
}

dhtmlXGridObject.prototype._sortByGroup=function(col,type,order){ 
	var b=this._groups_get();
	var a=[];
	for (var i=0; i<b.length; i++){
		b[i].idd="_sort_"+i;
		a["_sort_"+i]=b[i]._cntr.text;
	}
		
	this._sortCore(col,type,order,a,b);
	//add|delete|edit|ungroup
	this._groups_put(b);
	this.callEvent("onGridReconstructed",[])
	this.setSizes();
}
dhtmlXGridObject.prototype._inc_group=function(val,hidden,skip){
	if (val==="") val=" ";
	if (!this._groups[val]){ 
		this._groups[val]={text:val,row:this._addPseudoRow(),count:0,state:hidden?"plus":"minus"}; }
	var z=this._groups[val];
	//this._fixAlterCss();
	z.row._cntr=z;
		
	 
	var ind=this.rowsCol._dhx_find(z.row)+z.count+1;
	z.count++;
	
	if (!skip) {
	this._updateGroupView(z);
		this.updateGroups();
	}
	return ind;
}
dhtmlXGridObject.prototype._dec_group=function(z){
	if (!z) return;
	z.count--;
	if (z.count==0){
		z.row.parentNode.removeChild(z.row);
		this.rowsCol._dhx_removeAt(this.rowsCol._dhx_find(z.row));
		delete this._groups[z.text];
	}
	else
		this._updateGroupView(z);
	if (this._fake && !this._realfake)
		this._fake._dec_group(this._fake._groups[z.text]);
	this.updateGroups();
	return true;	
	}
dhtmlXGridObject.prototype._insertRowAt_gA=dhtmlXGridObject.prototype._insertRowAt;
dhtmlXGridObject.prototype._insertRowAt=function(r,ind,skip){
	if (typeof(this._groups)!="undefined"){
		if (this._realfake)
			var val=this._fake._bfs_cells(r.idd,this._gIndex).getValue();
		else
			if (this._bfs_cells3)
				var val=this._bfs_cells3(r,this._gIndex).getValue();
			else
				var val=this.cells3(r,this._gIndex).getValue();
			if (!val) val=" ";
			ind=this._inc_group(val,r.style.display=="none");		
	}
	var res=this._insertRowAt_gA(r,ind,skip);
	if (typeof(this._groups)!="undefined"){	
		this.expandGroup(val);
		this._updateGroupView(this._groups[val]);
		this.updateGroups();
	}
	return res;
}

dhtmlXGridObject.prototype._updateGroupView=function(z){ 
	if (this._fake && !this._realfake) return z.row.firstChild.innerHTML="&nbsp;";
	var mask = this._gmask||this._fake._gmask;
	var html="<img style='margin-bottom:-4px' src='"+this.imgURL+z.state+".gif'> ";
	if (this.customGroupFormat) html+=this.customGroupFormat(z.text,z.count);
	else html+=z.text+" ( "+z.count+" ) ";
	z.row.childNodes[mask._title].innerHTML=html;
}
dhtmlXGridObject.prototype._addPseudoRow=function(skip){
	
	var mask = this._gmask||this._fake._gmask;
	var r=mask.cloneNode(true)
	//cloneNode ignores custom attributes
	for (var i=0; i<r.childNodes.length; i++) {
		r.childNodes[i]._cellIndex=mask.childNodes[i]._cellIndex;
		if (this._realfake) r.childNodes[i].style.display="";
	}
	var that=this;
	
	r.onclick=function(e){ 
		if (!that.callEvent("onGroupClick",[this._cntr.text]))
			return;

		if (that._fake && that._realfake) 
			that._fake._switchGroupState(that._fake._groups[this._cntr.text].row); 
		else
			that._switchGroupState(this);
		(e||event).cancelBubble="true"; }
	r.ondblclick=function(e){ (e||event).cancelBubble="true"; }
	
	if (!skip){
		if (_isKHTML)
			this.obj.appendChild(r)
		else
			this.obj.firstChild.appendChild(r)
		this.rowsCol.push(r);
	}
	return r;
}

dhtmlXGridObject.prototype._groups_get=function(){
	var b=[];
	this._temp_par=this.obj.parentNode;
	this._temp_par.removeChild(this.obj);
	var a=[];
	for (var i=this.rowsCol.length-1; i>=0; i--){
		if (this.rowsCol[i]._cntr){
			this.rowsCol[i]._cntr._childs=a;
			a=[];
			b.push(this.rowsCol[i]);
		} else a.push(this.rowsCol[i]);
		this.rowsCol[i].parentNode.removeChild(this.rowsCol[i]);
	}
  return b;
}

dhtmlXGridObject.prototype._groups_put=function(b){ 
	var sts = this.rowsCol.stablesort;
	this.rowsCol=new dhtmlxArray(0);
	this.rowsCol.stablesort = sts;
	
	for (var i=0; i<b.length; i++){
		var gr=b[i]._cntr;
		this.obj.firstChild.appendChild(gr.row);
		this.rowsCol.push(gr.row)
		gr.row.idd=null;
		for (var j=0; j<gr._childs.length; j++){
			this.obj.firstChild.appendChild(gr._childs[j]);
			this.rowsCol.push(gr._childs[j])
		}
		delete gr._childs;
	}
	this._temp_par.appendChild(this.obj);
}
dhtmlXGridObject.prototype._groupExisting=function(b){ 
	if (!this.getRowsNum()) return;
	var b=[];
	this._temp_par=this.obj.parentNode;
	this._temp_par.removeChild(this.obj);
	var a=[];
	
	var mlen=this.rowsCol.length;
	for (var i=0; i<mlen; i++){
		var val=this.cells4(this.rowsCol[i].childNodes[this._gIndex]).getValue();
		this.rowsCol[i].style.display = "";
		if (!val) val=" ";
		
		if (!this._groups[val]){
			this._groups[val]={text:val,row:this._addPseudoRow(true),count:0,state:"minus"};
			var z=this._groups[val];
			z.row._cntr=z;
			this._groups[val]._childs=[];
			b.push(z.row)
		}
		
		this._groups[val].count++;
		this._groups[val]._childs.push(this.rowsCol[i]);
		this.rowsCol[i].parentNode.removeChild(this.rowsCol[i]);
	}
  for (var i=0; i<b.length; i++)
 	this._updateGroupView(b[i]._cntr)
  this._groups_put(b);
  if (this._fake && !this._realfake) {
  	this._mirror_rowsCol();
  	this._fake._groups=[];
  	this._fake._reset_view();
  }
  this.callEvent("onGridReconstructed",[])
  this.updateGroups();
}

dhtmlXGridObject.prototype._switchGroupState=function(row){
	var z=row._cntr;
	if (this._fake && !this._realfake) {
		z.state=this._fake._groups[row._cntr.text].row._cntr.state;
		this._fake._switchGroupState(this._fake._groups[row._cntr.text].row)
	}
	
	var ind=this.rowsCol._dhx_find(z.row)+1;
	z.state=z.state=="minus"?"plus":"minus";
	var st=z.state=="plus"?"none":"";
	
	while(this.rowsCol[ind] && !this.rowsCol[ind]._cntr){
		this.rowsCol[ind].style.display=st;
		ind++;
	}

	this._updateGroupView(z);
	this.callEvent("onGroupStateChanged",[z.text, (z.state=="minus")]);
	this.setSizes();
}
/**
*	@desc: expand group of rows
*	@param: val - value to use to determine what group to expand (in other words this should be value common for all of them)
*	@edition: Professional
*	@type: public
*/
dhtmlXGridObject.prototype.expandGroup=function(val){
	if (this._groups[val].state=="plus")
		this._switchGroupState(this._groups[val].row);
}
/**
*	@desc: collapse group of rows
*	@param: val - value to use to determine what group to collapse (in other words this should be value common for all of them)
*	@edition: Professional
*	@type: public
*/
dhtmlXGridObject.prototype.collapseGroup=function(val){
	if (this._groups[val].state=="minus")
		this._switchGroupState(this._groups[val].row);
}
/**
*	@desc: expand all groups
*	@edition: Professional
*	@type: public
*/
dhtmlXGridObject.prototype.expandAllGroups=function(){
	for(var i in this._groups)
		if (this._groups[i] && this._groups[i].state=="plus")
			this._switchGroupState(this._groups[i].row);
}
/**
*	@desc: collapse all groups
*	@edition: Professional
*	@type: public
*/
dhtmlXGridObject.prototype.collapseAllGroups=function(){
	for(var i in this._groups)
		if (this._groups[i] && this._groups[i].state=="minus")
			this._switchGroupState(this._groups[i].row);
}

dhtmlXGridObject.prototype.hideGroupColumn=function(ind,state){
	if (this._fake) return;
	var rind=-1;
	var row = this._gmask.childNodes;
	for (var i=0; i<row.length; i++)
		if (row[i]._cellIndex==ind) {
			rind = i;
			break;
	}
	if (rind == -1) return;
	for (var a in this._groups)
		this._groups[a].row.childNodes[rind].style.display=state?"none":"";
};
dhtmlXGridObject.prototype.groupStat=function(name,ind,math){
	math = this["_g_"+(math||"stat_total")];
	var summ=0; var index=0;
	this.forEachRowInGroup(name,function(id){
		summ=math(summ,this.cells(id,ind).getValue()*1,index)
		index++;
	})
	return summ;
}
dhtmlXGridObject.prototype.forEachRowInGroup=function(name,code){
	var row=this._groups[name].row.nextSibling;
	if (row){
		while (row && !row._cntr) {
			code.call(this,row.idd);
			row=row.nextSibling;
		}
	} else {
		var cs=this._groups[name]._childs;
		if (cs)
			for (var i=0; i<cs.length; i++)
				code.call(this,cs[i].idd);
	}
};
dhtmlXGridObject.prototype.updateGroups=function(){
	if (!this._gmask || !this._gmask._math || this._parsing) return;
	var r=this._gmask.childNodes;
	for (var i=0; i<r.length; i++)
		if (r[i]._counter) this._b_processing.apply(this,r[i]._counter)
}
dhtmlXGridObject.prototype._b_processing=function(a,ind,rind){
	var c=0,j=0; 
	//put editor in cache, so it can be used for custom html containers - can be moved in cells5(?)
	if (!this._ecache[this.cellType[ind]]) this.cells5({parentNode:{grid:this}},this.cellType[ind]);
	for (var i=this.rowsCol.length-1; i>=0; i--){
		if (!this.rowsCol[i]._cntr){
			c=a(c,this.cells3(this.rowsCol[i],ind).getValue()*1,j);
			j++;
		} else {
			this.cells5(this.rowsCol[i].childNodes[rind],this.cellType[ind]).setValue(c);
			j=c=0;
		}
	}
}

dhtmlXGridObject.prototype._g_stat_total=function(c,n,i){
	return c+n;
}
dhtmlXGridObject.prototype._g_stat_min=function(c,n,i){
	if (!i) c=Infinity;
	return Math.min(c,n);
}
dhtmlXGridObject.prototype._g_stat_max=function(c,n,i){
	if (!i) c=-Infinity;
	return Math.max(c,n);
}
dhtmlXGridObject.prototype._g_stat_average=function(c,n,i){
	return (c*i+n)/(i+1);
}
dhtmlXGridObject.prototype._g_stat_count=function(c,n,i){
	return ++c;
}

dhtmlXGridObject.prototype._in_header_collapse=function(t,i,c){
	var rt=t.tagName=="TD"?t:t.parentNode;
	i=rt._cellIndexS;
	if (!this._column_groups) this._column_groups=[];
	var cols=c[1].split(":")
	var cols=c[1].split(":");
	cols = [cols.shift(), cols.join(':')];
	var count = parseInt(cols[0]); 
	t.innerHTML=c[0]+"<img src='"+this.imgURL+"minus.gif' style='padding-right:10px;height:16px'/><span style='position:relative; top:-6px;'>"+(cols[1]||"")+"<span>";
	t.style.paddingBottom='0px';
	var self = this;
	this._column_groups[i]=t.getElementsByTagName("IMG")[0];
	this._column_groups[i].onclick=function(e){
		(e||event).cancelBubble=true;
		this._cstate=!this._cstate;
		for (var j=i+1; j<(i+count); j++)
			self.setColumnHidden(j,this._cstate)
		if (this._cstate){
			if (rt.colSpan && rt.colSpan>0) {
				rt._exp_colspan=rt.colSpan;
				var delta=Math.max(1,rt.colSpan-count)
				if (!_isFF) //create additional cells to compensate colspan
				for (var z=0; z<rt.colSpan-delta; z++){
					var td=document.createElement("TD");
					if (rt.nextSibling)
						rt.parentNode.insertBefore(td,rt.nextSibling);
					else
						rt.parentNode.appendChild(td);
				}	
				rt.colSpan=delta;
			}
            self.callEvent("onColumnCollapse",[i,this._cstate]);
		} else 
			if (rt._exp_colspan){
				rt.colSpan=rt._exp_colspan;
				if (!_isFF)
				for (var z=1; z<rt._exp_colspan; z++)
					rt.parentNode.removeChild(rt.nextSibling);
                self.callEvent("onColumnCollapse",[i,this._cstate]);
			}
		this.src=self.imgURL+(this._cstate?"plus.gif":"minus.gif");
		
		if (self.sortImg.style.display!="none")
			self.setSortImgPos();		
	}	
}
dhtmlXGridObject.prototype.collapseColumns = function (ind) {
    if (!this._column_groups[ind] || this._column_groups[ind]._cstate) return;
    this._column_groups[ind].onclick({});
}
dhtmlXGridObject.prototype.expandColumns = function (ind) {
    if (!this._column_groups[ind] || !this._column_groups[ind]._cstate) return;
    this._column_groups[ind].onclick({});
}

/**
*	@desc: enable pop up menu which allows hidding/showing columns
*	@edition: Professional
*	@type: public
*/
dhtmlXGridObject.prototype.enableHeaderMenu=function(columns)
{
	if (!window.dhtmlXMenuObject)
		return dhtmlx.message("You need to include DHTMLX Menu");

	if (!this._header_menu){
		var menu = this._header_menu = new dhtmlXMenuObject();
		menu.renderAsContextMenu();

		var that=this;
		menu.attachEvent("onBeforeContextMenu", function(){
			that._showHContext(columns);
			return true;
		});
		menu.attachEvent("onClick", function(id){
			var checked = this.getCheckboxState(id);

			var row = that.hdr.rows[1];
			for (var j=0; j<row.cells.length; j++){
				var c = row.cells[j];
				if (c._cellIndexS == id){
					var len = c.colSpan || 1;
					for (var i=0; i<len; i++)
						that.setColumnHidden(id*1+i,!checked);
				}
			}
		});

		this.attachEvent("onInit",function(){
			menu.addContextZone(this.hdr);
		});
		if (this.hdr.rows.length) this.callEvent("onInit",[]);
	}
};

dhtmlXGridObject.prototype.getHeaderMenu=function(columns)
{
	return this._header_menu;
};

dhtmlXGridObject.prototype._hideHContext=function(){
	if (this._header_menu)
		this._header_menu.hide();
};

dhtmlXGridObject.prototype._showHContext=function(columns)
{
	if (typeof columns == "string")
		columns = columns.split(this.delim);
	
	var true_ind = 0;
	var j = 0;
	this._header_menu.clearAll();

	for (var i=0; i<this.hdr.rows[1].cells.length; i++){
		var c = this.hdr.rows[1].cells[i];
		if (!columns || (columns[true_ind] &&  columns[true_ind] != "false")){
			if (c.firstChild && c.firstChild.tagName=="DIV") var val=c.firstChild.innerHTML;
			else var val = c.innerHTML;
			val = val.replace(/<[^>]*>/gi,"");
			var visible = !(this.isColumnHidden(true_ind) || (this.getColWidth(true_ind)==0));
			this._header_menu.addCheckbox("child", this._header_menu.topId, j, true_ind, val, visible);
			j++;
		}
		true_ind+=(c.colSpan||1);
	}	
}

dhtmlXGridObject.prototype._process_json_row=function(r, data){
	r._attrs=data;
	for (var j = 0; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
	};
	if (data.userdata)
		for (var a in data.userdata)
			this.setUserData(r.idd,a,data.userdata[a]);
			
	data = this._c_order?this._swapColumns(data.data):data.data;

	for (var i=0; i<data.length; i++)
		if (typeof data[i] == "object" && data[i] != null){
			r.childNodes[i]._attrs=data[i];
			if (data[i].type) r.childNodes[i]._cellType=data[i].type;
			data[i]=data[i].value;
		}
	this._fillRow(r, data);
	return r;
};


dhtmlXGridObject.prototype._process_js_row=function(r, data){
	r._attrs=data;
	for (var j = 0; j < r.childNodes.length; j++)
		r.childNodes[j]._attrs={};

	if (data.userdata)
		for (var a in data.userdata)
			this.setUserData(r.idd,a,data.userdata[a]);
			
	var arr = [];
	for (var i=0; i<this.columnIds.length; i++){
		arr[i] = data[this.columnIds[i]];
		if (typeof arr[i] == "object" && arr[i] != null){
			r.childNodes[i]._attrs=arr[i];
			if (arr[i].type) r.childNodes[i]._cellType=arr[i].type;
			arr[i]=arr[i].value;
		}
		if (!arr[i] && arr[i]!==0)
			arr[i]="";
	}

	this._fillRow(r, arr);
	return r;
};

dhtmlXGridObject.prototype.updateFromJSON = function(url, insert_new, del_missed, afterCall){
	if (typeof insert_new == "undefined")
		insert_new=true;
	this._refresh_mode=[
		true,
		insert_new,
		del_missed
	];
	
	this.load(url,afterCall,"json");
},
dhtmlXGridObject.prototype._refreshFromJSON = function(data){
		if (this._f_rowsBuffer) this.filterBy(0,"");
		reset = false;
		if (window.eXcell_tree){
			eXcell_tree.prototype.setValueX=eXcell_tree.prototype.setValue;
			eXcell_tree.prototype.setValue=function(content){
				var r=this.grid._h2.get[this.cell.parentNode.idd]
				if (r && this.cell.parentNode.valTag){
					this.setLabel(content);
				} else
					this.setValueX(content);
			};
		}
	
		var tree = this.cellType._dhx_find("tree");
		var pid = data.parent||0;
	
		var del = {
		};
	
		if (this._refresh_mode[2]){
			if (tree != -1)
				this._h2.forEachChild(pid, function(obj){
					del[obj.id]=true;
				}, this);
			else
				this.forEachRow(function(id){
					del[id]=true;
				});
		}
	
		var rows = data.rows;
	
		for (var i = 0; i < rows.length; i++){
			var row = rows[i];
			var id = row.id;
			del[id]=false;
	
			if (this.rowsAr[id] && this.rowsAr[id].tagName!="TR"){
				if (this._h2)
					this._h2.get[id].buff.data=row;
				else
					this.rowsBuffer[this.getRowIndex(id)].data=row;
				this.rowsAr[id]=row;
			} else if (this.rowsAr[id]){
					this._process_json_row(this.rowsAr[id], row, -1);
					this._postRowProcessing(this.rowsAr[id],true)
				} else if (this._refresh_mode[1]){
					var dadd={
						idd: id,
						data: row,
						_parser: this._process_json_row,
						_locator: this._get_json_data
					};
					
					var render_index = this.rowsBuffer.length;
					if (this._refresh_mode[1]=="top"){
						this.rowsBuffer.unshift(dadd);
						render_index = 0;
					} else
						this.rowsBuffer.push(dadd);
						
					if (this._h2){ 
						reset=true;
						(this._h2.add(id,pid)).buff=this.rowsBuffer[this.rowsBuffer.length-1];
					}
						
					this.rowsAr[id]=row;
					row=this.render_row(render_index);
					this._insertRowAt(row,render_index?-1:0)
				}
		}
				
		if (this._refresh_mode[2])
			for (id in del){
				if (del[id]&&this.rowsAr[id])
					this.deleteRow(id);
			}
	
		this._refresh_mode=null;
		if (window.eXcell_tree)
			eXcell_tree.prototype.setValue=eXcell_tree.prototype.setValueX;
			
		if (reset) this._renderSort();
		if (this._f_rowsBuffer) {
			this._f_rowsBuffer = null;
			this.filterByAll();
		}
	},

	dhtmlXGridObject.prototype._process_js=function(data){
		return this._process_json(data, "js");
	}

	dhtmlXGridObject.prototype._parseOptionsJson=function(json){
		if (json.coll_options){
			for (var key in json.coll_options){
				var data = json.coll_options[key];
				var ind = this.getColIndexById(key);
				
				var combo;
				if (this.cellType[ind] == "combo"){
					var combo = this.getColumnCombo(ind);
					combo.addOption(data);
				}
				else if (this.cellType[ind].indexOf("co")==0){
					var combo=this.getCombo(ind);
					for (var i=0; i<data.length; i++)
						combo.put(data[i].value, data[i].label);
				}
			}
			this._colls_loaded=true;
		}
	}

	dhtmlXGridObject.prototype._parseHeadJson=function(json){
		if (!json.head || !json.head.length) return;

		var headCol = json.head;
		var settings = json.settings;

		var awidthmet = "setInitWidths";
		var split = false;

		if (settings && settings.colwidth == "%")
			awidthmet="setInitWidthsP";
	
		if (settings && settings.splitat == "%")
			split=settings.splitat;

		//drop existing grid here, to prevent loss of initialization parameters
	    if (this.hdr.rows.length > 0) 
	    	this.clearAll(true);

		var sets = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
	
		var attrs = ["value", "width", "type", "align", "sort","hidden", "id"];
		var calls = ["", awidthmet, "setColTypes", "setColAlign", "setColSorting", 
					"", "setColumnIds"];
	
		for (var i = 0; i < headCol.length; i++)
			for (var j = 0; j < attrs.length; j++)
				sets[j].push(headCol[i][attrs[j]]);

		this.setHeader(sets[0]);
		for (var i = 0; i < calls.length; i++)
			if (calls[i])
				this[calls[i]](sets[i].join(this.delim));
	
		for (var i = 0; i < headCol.length; i++){
			var options = headCol[i].options
			if (headCol[i].options)
				if (this.cellType[i] == "clist"){
					this.registerCList(i, options);
				} else {
					var combo = this.getCombo(i);
					for (var j = 0; j < options.length; j++)
						combo.put(options[j].id, options[j].value);
				}
		}
			
	
		this.init();

        var param=sets[5].join(this.delim);
        //preserving state of hidden columns, if not specified directly
		if (this.setColHidden && param.replace(/,/g,"")!="")
			this.setColHidden(param);

		if ((split)&&(this.splitAt))
			this.splitAt(split);
	};

	dhtmlXGridObject.prototype._process_json=function(data, mode){
		this._parsing=true;
		try {
			var data = data.responseText || data;
			if (typeof data == "string"){
				eval("dhtmlx.temp="+data+";");
				data = dhtmlx.temp;
			}
		} catch(e){
				dhx4.callEvent("onLoadXMLError", ["Incorrect JSON",
					(data.xmlDoc||data),
					this
				]);
				data = {rows:[]};
		}
			
		if (this._refresh_mode) return this._refreshFromJSON(data);				

		if (data.head)
			this._parseHeadJson(data);
		this._parseOptionsJson(data);

		var cr = parseInt(data.pos||0);
		var total = parseInt(data.total_count||0);
		
		var reset = false;
		if (total){
			if (!this.rowsBuffer[total-1]){
				if (this.rowsBuffer.length)
					reset=true;
			this.rowsBuffer[total-1]=null;
			} 
			if (total<this.rowsBuffer.length){
				this.rowsBuffer.splice(total, this.rowsBuffer.length - total);
				reset = true;
			}
		}
			
		var userdata = mode === "js" ? data.userdata : data;
		for (var key in userdata){
			if (mode === "js" || key!="rows")
				this.setUserData("",key, userdata[key]);
		}

		if (mode == "js" && data.collections){
			for (var colkey in data.collections){
				var index = this.getColIndexById(colkey);
				var colrecs = data.collections[colkey];
				if (index !== window.undefined){
					if (this.cellType[index] == "clist"){
						colplaindata=[];
						for (var j=0; j<colrecs.length; j++)
							colplaindata.push(colrecs[j].label);
						this.registerCList(index, colplaindata);
					} else {
						var combo = this.getCombo(index);
						for (var j = 0; j < colrecs.length; j++)
							combo.put(colrecs[j].value, colrecs[j].label);
					}
				}
			}
		}
		
		if (this.isTreeGrid())
			return this._process_tree_json(data, null, null, mode);
			
		if (mode == "js"){
			if (data.data)
				data = data.data;
			for (var i = 0; i < data.length; i++){
				if (this.rowsBuffer[i+cr])
					continue;

				var row = data[i];
				var id  = row.id||(i+1);
				this.rowsBuffer[i+cr]={
					idd: id,
					data: row,
					_parser: this._process_js_row,
					_locator: this._get_js_data
				};

				this.rowsAr[id]=data[i];
			}
		} else {
			for (var i = 0; i < data.rows.length; i++){
				if (this.rowsBuffer[i+cr])
					continue;
				var id = data.rows[i].id;
				this.rowsBuffer[i+cr]={
					idd: id,
					data: data.rows[i],
					_parser: this._process_json_row,
					_locator: this._get_json_data
				};
	
				this.rowsAr[id]=data.rows[i];
			}
		}
		
		this.callEvent("onDataReady", []);
		if (reset && this._srnd){
			var h = this.objBox.scrollTop;
			this._reset_view();
			this.objBox.scrollTop = h;
		} else {
			this.render_dataset();
		}
		
		this._parsing=false;
}

dhtmlXGridObject.prototype._get_json_data=function(data, ind){
	var obj = data.data[ind];
	if (typeof obj == "object"){
		return obj?obj.value:"";
	} else
		return obj;
};

dhtmlXGridObject.prototype._process_tree_json=function(data,top,pid,mode){
	this._parsing=true;
	var main=false;
	if (!top){
		this.render_row=this.render_row_tree;
		main=true;
		top=data;
		pid=top.parent||0;
		if (pid=="0") pid=0;
		if (!this._h2)	 this._h2=this._createHierarchy();
		if (this._fake) this._fake._h2=this._h2;
	} 
	
	if (mode == "js"){
		if (top.data && !pid) 
			data = top.data;
		if (top.rows)
			top = top.rows;
		for (var i = 0; i < top.length; i++){
			var id = top[i].id;
			var row=this._h2.add(id,pid);
			row.buff={ idd:id, data:top[i], _parser: this._process_js_row, _locator:this._get_js_data };

			if (top[i].open)
			    row.state="minus";
				
			this.rowsAr[id]=row.buff;
		    this._process_tree_json(top[i],top[i],id,mode);
		}
	} else {
		if (top.rows) {
			for (var i = 0; i < top.rows.length; i++){
					var id = top.rows[i].id;
					var row=this._h2.add(id,pid);
					row.buff={ idd:id, data:top.rows[i], _parser: this._process_json_row, _locator:this._get_json_data };
					if (top.rows[i].open)
					    row.state="minus";
					
					this.rowsAr[id]=row.buff;
				    this._process_tree_json(top.rows[i],top.rows[i],id,mode);
			}
		}
	}
		
	if (main){ 
		
		if (pid!=0) this._h2.change(pid,"state","minus")
		this._updateTGRState(this._h2.get[pid]);
		this._h2_to_buff();
		
		this.callEvent("onDataReady", []);
		if (pid!=0 && (this._srnd || this.pagingOn))
			this._renderSort();
		else
			this.render_dataset();
		
		
	
		if (this._slowParse===false){
			this.forEachRow(function(id){
				this.render_row_tree(0,id)
			})
		}
		this._parsing=false;

		if (pid!=0 && !this._srnd)
		   this.callEvent("onOpenEnd",[pid,1]);	
	}
}

dhtmlXGridObject.prototype.enableAccessKeyMap = function(){
	/*
		keymap like MS Access offers
	*/
	this._select_ifpossible=function(){
		if (this.editor && this.editor.obj && this.editor.obj.select) this.editor.obj.select();
	};
	this._key_events={
				//ctrl-enter
				k13_1_0:function(){
					this.editStop();
				},
				//shift-enter
				k13_0_1:function(){
					this._key_events.k9_0_1.call(this);
				},
				//enter
				k13_0_0:function(){
					this._key_events.k9_0_0.call(this);
	            },
	            //tab
	            k9_0_0:function(){
						this.editStop();
					if (!this.callEvent("onTab",[true])) return true;
					var z=this._getNextCell(null,1);
					if (z) {
						if (this.pagingOn) this.showRow(z.parentNode.idd);
						this.selectCell(z.parentNode,z._cellIndex,(this.row!=z.parentNode),false,true);
						this._still_active=true;
					}
					this._select_ifpossible();
	            },
	            //shift-tab
				k9_0_1:function(){
					this.editStop();
					if (!this.callEvent("onTab",[false])) return true;
					var z=this._getNextCell(null,-1);
					if (z) {
						this.selectCell(z.parentNode,z._cellIndex,(this.row!=z.parentNode),false,true);
						this._still_active=true;
					}
					this._select_ifpossible();
	            },
	            //f2 key
	            k113_0_0:function(){
	            	if (this._f2kE) this.editCell();
	            },
	            //space
	            k32_0_0:function(){
	            	var c=this.cells4(this.cell);
	            	if (!c.changeState || (c.changeState()===false)) return false;
	            },
	            //escape
	            k27_0_0:function(){
	            	this.editStop(true);
	            },
	            //pageUp
	            k33_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage-1);
	            	else this.scrollPage(-1);            		
		        },
		        //pageDown
				k34_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage+1);
	            	else this.scrollPage(1);
		        },
		        //left
				k37_0_0:function(){
					if (this.editor) return false;
	            	if(this.isTreeGrid())
	            		this.collapseKids(this.row);
	            	else this._key_events.k9_0_1.call(this);
		        },
		        //right
				k39_0_0:function(){
					if (this.editor) return false;
					if(!this.editor && this.isTreeGrid())
	            		this.expandKids(this.row);
	            	else this._key_events.k9_0_0.call(this);
	            },
	            //ctrl left
				k37_1_0:function(){
					if (this.editor) return false;
					this.selectCell(this.row,0,false,false,true);
					this._select_ifpossible();
		        },
		        //ctrl right
				k39_1_0:function(){
					if (this.editor) return false;
					this.selectCell(this.row,this._cCount-1,false,false,true);
					this._select_ifpossible();
	            },
	            //ctrl up
				k38_1_0:function(){
				
					this.selectCell(this.rowsCol[0],this.cell._cellIndex,true,false,true);
					this._select_ifpossible();
		        },
		        //ctrl down
				k40_1_0:function(){
					this.selectCell(this.rowsCol[this.rowsCol.length-1],this.cell._cellIndex,true,false,true);
					this._select_ifpossible();
	            },
	            //shift up
				k38_0_1:function(){
					var rowInd = this.getRowIndex(this.row.idd);
					var nrow=this._nextRow(rowInd,-1);
					if (!nrow || nrow._sRow || nrow._rLoad) return false;
	                this.selectCell(nrow,this.cell._cellIndex,true,false,true);
					this._select_ifpossible();
		        },
		        //shift down
				k40_0_1:function(){
					var rowInd = this.getRowIndex(this.row.idd);
					var nrow=this._nextRow(rowInd,1);
					if (!nrow || nrow._sRow || nrow._rLoad) return false;
	                this.selectCell(nrow,this.cell._cellIndex,true,false,true);
	                this._select_ifpossible();
	            },   
	            //ctrl shift up  
				k38_1_1:function(){
					var rowInd = this.getRowIndex(this.row.idd);
					for (var i = rowInd; i >= 0; i--){
						this.selectCell(this.rowsCol[i],this.cell._cellIndex,true,false,true);
					}
		        },
		        //ctrl shift down
				k40_1_1:function(){
					var rowInd = this.getRowIndex(this.row.idd);
					for (var i = rowInd+1; i <this.rowsCol.length; i++){
						this.selectCell(this.rowsCol[i],this.cell._cellIndex,true,false,true);
					}
	            },    
	            //down               
				k40_0_0:function(){
					if (this.editor && this.editor.combo)
						this.editor.shiftNext();
					else{
						if (!this.row.idd) return;
						var rowInd = rowInd=this.getRowIndex(this.row.idd)+1;
						if (this.rowsBuffer[rowInd]){
							var nrow=this._nextRow(rowInd-1,1);
							if (this.pagingOn && nrow) this.showRow(nrow.idd);
							this._Opera_stop=0;
	                        this.selectCell(nrow,this.cell._cellIndex,true,false,true);
	                    }
	                    else {
	                    	if (!this.callEvent("onLastRow", [])) return false;
	                    	this._key_events.k34_0_0.apply(this,[]);
	                	}
					}
					this._still_active=true;								
	            },
	            //home
	            k36_0_0:function(){ 
	            	return this._key_events.k37_1_0.call(this);
	            },
	            //end
	            k35_0_0:function(){ 
	            	return this._key_events.k39_1_0.call(this);
	            },            
	            //ctrl-home
	            k36_1_0:function(){ 
	            	if (this.editor || !this.rowsCol.length) return false;
					this.selectCell(this.rowsCol[0],0,true,false,true);
					this._select_ifpossible();
	            },
	            //ctrl-end
	            k35_1_0:function(){ 
	            	if (this.editor || !this.rowsCol.length) return false;
					this.selectCell(this.rowsCol[this.rowsCol.length-1],this._cCount-1,true,false,true);
					this._select_ifpossible();
	            },  
	            //padeup
	            k33_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage-1);
	            	else this.scrollPage(-1);            		
		        },
		        //pagedown
				k34_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage+1);
	            	else this.scrollPage(1);
		        },  
		        //up                                
				k38_0_0:function(){
					if (this.editor && this.editor.combo)
						this.editor.shiftPrev();
					else{
					
						if (!this.row.idd) return;
						var rowInd = rowInd=this.getRowIndex(this.row.idd)+1;
						if (rowInd!=-1){
							var nrow=this._nextRow(rowInd-1,-1);
	                        this._Opera_stop=0;
	                        if (this.pagingOn && nrow) this.showRow(nrow.idd);
	                        this.selectCell(nrow,this.cell._cellIndex,true,false,true);
	                    }
						else this._key_events.k33_0_0.apply(this,[]);
					}
					this._still_active=true;
	            }
			};

	};
	dhtmlXGridObject.prototype.enableExcelKeyMap = function(){
	/*
		keymap like MS Excel offers
	*/
	this._key_events={
				k13_1_0:function(){
					this.editStop();
				},
				k13_0_1:function(){
					this.editStop();
					this._key_events.k38_0_0.call(this);
				},
				k13_0_0:function(){
					this.editStop();
					this.callEvent("onEnter",[(this.row?this.row.idd:null),(this.cell?this.cell._cellIndex:null)]);
					this._still_active=true;
					this._key_events.k40_0_0.call(this);
	            },
	            k9_0_0:function(){
					this.editStop();
					if (!this.callEvent("onTab",[true])) return true;
					if (this.cell && (this.cell._cellIndex+1)>=this._cCount) return;
					var z=this._getNextCell(null,1);
					if (z && this.row==z.parentNode){
						this.selectCell(z.parentNode,z._cellIndex,true);
						this._still_active=true;
					}
				},
				k9_0_1:function(){
					this.editStop();
					if (!this.callEvent("onTab",[false])) return true;
					if (this.cell && (this.cell._cellIndex==0)) return;
					var z=this._getNextCell(null,-1);
					if (z && this.row==z.parentNode) {
						this.selectCell(z.parentNode,z._cellIndex,true);
						this._still_active=true;
					}
	            },
	            k113_0_0:function(){
	            	if (this._f2kE) this.editCell();
	            },
	            k32_0_0:function(){
	            	var c=this.cells4(this.cell);
	            	if (!c.changeState || (c.changeState()===false)) return false;
	            },
	            k27_0_0:function(){
	            	this.editStop(true);
	            	this._still_active=true;
	            },
	            k33_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage-1);
	            	else this.scrollPage(-1);            		
		        },
				k34_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage+1);
	            	else this.scrollPage(1);
		        },
				k37_0_0:function(){
					if (this.editor) return false;
	            	if(this.isTreeGrid())
	            		this.collapseKids(this.row);
	            	else this._key_events.k9_0_1.call(this);
		        },
				k39_0_0:function(){
					if (this.editor) return false;
					if(!this.editor && this.isTreeGrid())
	            		this.expandKids(this.row);
	            	else this._key_events.k9_0_0.call(this);
	            },
				k37_1_0:function(){
					if (this.editor) return false;
					this.selectCell(this.row,0,true);
		        },
				k39_1_0:function(){
					if (this.editor) return false;
					this.selectCell(this.row,this._cCount-1,true);
	            }, 
				k38_1_0:function(){
					if (this.editor || !this.rowsCol.length) return false;
					this.selectCell(this.rowsCol[0],this.cell._cellIndex,true);
		        },
				k40_1_0:function(){
					if (this.editor || !this.rowsCol.length) return false;
					this.selectCell(this.rowsCol[this.rowsCol.length-1],this.cell._cellIndex,true);
	            },
				k38_0_1:function(){
					if (this.editor || !this.rowsCol.length) return false;
					var rowInd = this.row.rowIndex;
					var nrow=this._nextRow(rowInd-1,-1);
					if (!nrow || nrow._sRow || nrow._rLoad) return false;
	                this.selectCell(nrow,this.cell._cellIndex,true,true);
		        },
				k40_0_1:function(){
					if (this.editor || !this.rowsCol.length) return false;
					var rowInd = this.row.rowIndex;
					var nrow=this._nextRow(rowInd-1,1);
					if (!nrow || nrow._sRow || nrow._rLoad) return false;
	                this.selectCell(nrow,this.cell._cellIndex,true,true);
	            },     
				k38_1_1:function(){
					if (this.editor || !this.rowsCol.length) return false;
					var rowInd = this.row.rowIndex;
					for (var i = rowInd - 1; i >= 0; i--){
						this.selectCell(this.rowsCol[i],this.cell._cellIndex,true,true);
					}
		        },
				k40_1_1:function(){
					if (this.editor || !this.rowsCol.length) return false;
					var rowInd = this.row.rowIndex;
					for (var i = rowInd; i <this.rowsCol.length; i++){
						this.selectCell(this.rowsCol[i],this.cell._cellIndex,true,true);
					}
	            },                   
				k40_0_0:function(){
					var master = this._realfake?this._fake:this;
					if (this.editor && this.editor.combo)
						this.editor.shiftNext();
					else{
						if (this.editor) return false;
						var rowInd = Math.max((master._r_select||0),this.getRowIndex(this.row.idd));
						var row = this._nextRow(rowInd, 1);

						if (row){
							master._r_select=null;
							this.selectCell(row, this.cell._cellIndex, true);
							if (master.pagingOn) master.showRow(row.idd);
						} else {
	                    	if (!this.callEvent("onLastRow", [])) return false;
	                    	this._key_events.k34_0_0.apply(this,[]);
	                	}
					}
	            },
	            k36_0_0:function(){ //home
	            	return this._key_events.k37_1_0.call(this);
	            },
	            k35_0_0:function(){ //ctrl-home
	            	return this._key_events.k39_1_0.call(this);
	            },            
	            k36_1_0:function(){ //home
	            	if (this.editor || !this.rowsCol.length) return false;
					this.selectCell(this.rowsCol[0],0,true);
	            },
	            k35_1_0:function(){ //ctrl-end
	            	if (this.editor || !this.rowsCol.length) return false;
					this.selectCell(this.rowsCol[this.rowsCol.length-1],this._cCount-1,true);
	            },  
	            k33_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage-1);
	            	else this.scrollPage(-1);            		
		        },
				k34_0_0:function(){
	            	if(this.pagingOn)
	            		this.changePage(this.currentPage+1);
	            	else this.scrollPage(1);
		        },                                  
				k38_0_0:function(){	
					var master = this._realfake?this._fake:this;
					if (this.editor && this.editor.combo)
						this.editor.shiftPrev();
					else{
						if (this.editor) return false;
						if (!this.row.idd) return;
						var rowInd = this.getRowIndex(this.row.idd)+1;
						if (rowInd != -1 && (!this.pagingOn || (rowInd!=1))){
							var nrow = this._nextRow(rowInd-1, -1);
							this.selectCell(nrow, this.cell._cellIndex, true);
							if (master.pagingOn && nrow) master.showRow(nrow.idd);
						} else {
							this._key_events.k33_0_0.apply(this,[]);
						}
					}
	            },
	            k_other:function(ev){ 
	            	if (this.editor) return false;
	            	if (!ev.ctrlKey && ev.keyCode>=40 && (ev.keyCode < 91 || (ev.keyCode >95 && ev.keyCode <111) || ev.keyCode > 187))
	            		if (this.cell){
	            			/*ORIGINAL
	            			var c=this.cells4(this.cell);
	            			if (c.isDisabled()) return false;
	            			var t=c.getValue();
	            			if (c.editable!==false) c.setValue("");
	            			this.editCell();
	            			if (this.editor) {
	            				this.editor.val=t;
	            				if (this.editor.obj && this.editor.obj.select)
	            					this.editor.obj.select();
	        				}
	            			else c.setValue(t);
	            			*/
	            		}
	            }
			};

	};
	
  /**
  *   @desc: sets marked cells support to enabled or disabled state
  *   @type: public
  *   @param: state - true or false
  */
 dhtmlXGridObject.prototype.enableMarkedCells = function(fl){
  	this.markedRowsArr = new dhtmlxArray(0);
	this.markedCellsArr = new Array(0);
	this.lastMarkedRow = null;
	this.lastMarkedColumn = null;
 	this.markedCells = true;
	this.lastMarkMethod = 0;
	if(arguments.length>0){
		if(!dhx4.s2b(fl))
			this.markedCells = false;
	}
 };
  /**
  *   @desc: occures on cell click
  *   @type: private
  *   @param: [el] - cell to click on
  *   @param: [markMethod] - 0 - simple click, 1 - shift, 2 - ctrl
  */
 dhtmlXGridObject.prototype.doMark = function(el,markMethod){ 

		var _rowId = el.parentNode.idd;
		this.setActive(true);
		if (!_rowId) return;
		this.editStop();
		this.cell=el;
		this.row=el.parentNode;
		var _cellIndex = el._cellIndex;				
		
		if(!markMethod) markMethod = 0;
		
	    if(markMethod==0){
	        this.unmarkAll() ;	 
	    }
		else if(markMethod==1){
			
			if(this.lastMarkedRow) {
				var r_start = Math.min(this.getRowIndex(_rowId),this.getRowIndex(this.lastMarkedRow));
				var r_end = Math.max(this.getRowIndex(_rowId),this.getRowIndex(this.lastMarkedRow));
				
				var c_start = Math.min(_cellIndex,this.lastMarkedColumn);
				var c_end = Math.max(_cellIndex,this.lastMarkedColumn);
			
				for(var i = r_start; i < r_end+1; i++){
					for(var j = c_start; j < c_end+1; j++){
						this.mark(this.getRowId(i),j,true);
						
					}
				}
			}
		}
		else if(markMethod==2){
			if(this.markedRowsArr._dhx_find(_rowId)!=-1){ 
				for(var ci = 0; ci < this.markedCellsArr[_rowId].length; ci++){
					if(this.markedCellsArr[_rowId][ci]==_cellIndex){
						this.mark(_rowId,_cellIndex,false);
						return true;
					}
				}
				
			}
			
		}
		
		if(!this.markedCellsArr[_rowId]) 
			this.markedCellsArr[_rowId] = new dhtmlxArray(0);
		
		if(markMethod!=1) 
			this.mark(_rowId,_cellIndex);
			
		this.moveToVisible(this.cells(_rowId,_cellIndex).cell);
		this.lastMarkedRow = _rowId;
		this.lastMarkedColumn = _cellIndex;
		this.lastMarkMethod = markMethod;
				
 }
/**
  	*   @desc: sets selection or removes selection from specified cell
    *   @param: r - row object or row index
    *   @param: cInd - cell index
    *   @param: state - true or false 
	*   @type: public
 */
dhtmlXGridObject.prototype.mark = function(rid,cindex,fl){
	if(arguments.length>2){
		if(!dhx4.s2b(fl)){
			this.cells(rid,cindex).cell.className = this.cells(rid,cindex).cell.className.replace(/cellselected/g,"");
if(this.markedRowsArr._dhx_find(rid)!=-1){
	var ci = this.markedCellsArr[rid]._dhx_find(cindex);
	if(ci!=-1){
		this.markedCellsArr[rid]._dhx_removeAt(ci);
		if(this.markedCellsArr[rid].length==0){
			this.markedRowsArr._dhx_removeAt(this.markedRowsArr._dhx_find(rid));
		}
		this.callEvent("onCellUnMarked",[rid,cindex]);
			}
		}
		return true;
	}
}
this.cells(rid,cindex).cell.className+= " cellselected";

if(this.markedRowsArr._dhx_find(rid)==-1) 
	this.markedRowsArr[this.markedRowsArr.length] = rid;
	
if(!this.markedCellsArr[rid]) 
	this.markedCellsArr[rid] = new dhtmlxArray(0);
if(this.markedCellsArr[rid]._dhx_find(cindex)==-1){
	this.markedCellsArr[rid][this.markedCellsArr[rid].length] = cindex;
	this.callEvent("onCellMarked",[rid,cindex]);
	}
	
}
/**
  	*   @desc: removes selection from all marked cell
   	*   @type: public
 */
dhtmlXGridObject.prototype.unmarkAll = function(){
	if(this.markedRowsArr){
		for(var ri = 0; ri < this.markedRowsArr.length; ri++){
			var rid = this.markedRowsArr[ri];
			if (this.rowsAr[rid])
				for(var ci = 0; ci < this.markedCellsArr[rid].length; ci++){
					this.callEvent("onCellUnMarked",[rid,this.markedCellsArr[rid][ci]])
		this.cells(rid,this.markedCellsArr[rid][ci]).cell.className = this.cells(rid,this.markedCellsArr[rid][ci]).cell.className.replace(/cellselected/g,"");
				}
		} 
		this.markedRowsArr = new dhtmlxArray(0);
		this.markedCellsArr = new Array(0);
	}
	return true;
}
/**
  	*   @desc: gets marked cells
   	*   @returns: the array of marked cells	(pairs of row id and column index)
	*   @type: public
 */
dhtmlXGridObject.prototype.getMarked = function(){
	var marked = new Array();
	if(this.markedRowsArr)
	for(var ri = 0; ri < this.markedRowsArr.length; ri++){
		var rid = this.markedRowsArr[ri];
		for(var ci = 0; ci < this.markedCellsArr[rid].length; ci++){
			marked[marked.length] = [rid,this.markedCellsArr[rid][ci]];
		}
	} 
	return marked;		
}

/**
*	@desc: cell with support for math formulas
*	@param: cell - cell object
*	@type:  private
*   @edition: Professional
*/
function eXcell_math(cell){
	if (cell){
		this.cell = cell;
    	this.grid = this.cell.parentNode.grid;
	}
	this.edit = function(){
		this.grid.editor = new eXcell_ed(this.cell);
		this.grid.editor.fix_self=true;
		this.grid.editor.getValue=this.cell.original?(function(){ return this.cell.original}):this.getValue;
		this.grid.editor.setValue=this.setValue;
		this.grid.editor.edit();
	}
	this.isDisabled = function(){ return !this.grid._mathEdit; }
	this.setValue = function(val){
				val=this.grid._compileSCL(val,this.cell,this.fix_self);
                if (this.grid._strangeParams[this.cell._cellIndex])
    				this.grid.cells5(this.cell,this.grid._strangeParams[this.cell._cellIndex]).setValue(val);
                else{
                    this.setCValue(val);
    	            this.cell._clearCell=false;
	            }
    }
    this.getValue = function(){
        if (this.grid._strangeParams[this.cell._cellIndex])
			return this.grid.cells5(this.cell,this.grid._strangeParams[this.cell._cellIndex]).getValue();
        
        return this.cell.innerHTML;
    }
}
eXcell_math.prototype = new eXcell;

dhx4.attachEvent("onGridCreated", function(grid){
	grid._reset_math();
  if (grid._was_created_math) return;
    grid._was_created_math = true;

	grid.attachEvent("onClearAll", grid._reset_math);
grid.attachEvent("onCellChanged",function(id,ind){
	if (this._mat_links[id]){ 
		var cell=this._mat_links[id][ind];
		if (cell){ 
			for (var i=0; i<cell.length; i++)
      if (cell[i].parentNode)
        this.cells5(cell[i]).setValue(this._calcSCL(cell[i]));
		}
	}
	if (!this._parsing && this._aggregators[ind]){
		var pid=this._h2.get[id].parent.id;
		if (pid!=0){
			var ed=this.cells(pid,ind);
			ed.setValue(this._calcSCL(ed.cell));
		}
	}
})
grid.attachEvent("onAfterRowDeleted",function(id,pid){ //will be called for each delete operation, may be optimized
	if (pid!=0)
		if (!this._parsing && this._aggregators.length){
			for (var ind=0; ind < this._aggregators.length; ind++) {
				if (this._aggregators[ind]){
						var ed=this.cells(pid,ind);
						ed.setValue(this._calcSCL(ed.cell));
				}
			};
		}
	return true;
})
grid.attachEvent("onXLE", grid._refresh_math);

});

dhtmlXGridObject.prototype._reset_math=function(){
  this._mat_links   = {};
  this._aggregators = [];
};
dhtmlXGridObject.prototype._refresh_math=function(){
  for (var i=0; i < this._aggregators.length; i++) {
    if (this._aggregators[i])
      this._h2.forEachChild(0,function(el){
        if (el.childs.length!=0){
          var ed=this.cells(el.id,i);
          ed.setValue(this._calcSCL(ed.cell));
        }
      },this);
  };
};

dhtmlXGridObject.prototype.refreshMath=function(status){
    this._mat_links = {};
    for (var i=0; i<this.getColumnsNum(); i++){
      if (this.getColType(i) == "math"){
        this.forEachRow(function(id){
          var cell = this.cells(id, i);
          cell.setValue(cell.cell.original || cell.getValue());
        });
      }
    }
};

/**
*	@desc: enable/disable serialization of math formulas
*	@param: status - true/false
*	@type:  public
*   @edition: Professional
*/
dhtmlXGridObject.prototype.enableMathSerialization=function(status){
    this._mathSerialization=dhx4.s2b(status);
}
/**
*	@desc: enable/disable rounding while math calculations
*	@param: digits - set hom many digits must be rounded, set 0 for disabling
*	@type:  public
*   @edition: Professional
*/
dhtmlXGridObject.prototype.setMathRound=function(digits){
	this._roundDl=digits;
    this._roundD=Math.pow(10,digits);
}
/**
*	@desc: enable/disable editing of math cells
*	@param: status - true/false
*	@type:  public
*   @edition: Professional
*/
dhtmlXGridObject.prototype.enableMathEditing=function(status){
    this._mathEdit=dhx4.s2b(status);
}

/**
*	@desc: calculate value of math cell
*	@param: cell - math cell
*	@returns: cell value
*	@type:  private
*   @edition: Professional
*/
dhtmlXGridObject.prototype._calcSCL=function(cell){ 
    if (!cell._code) return this.cells5(cell).getValue();
    try{
    	dhtmlx.agrid=this;
    	var z=eval(cell._code);
    } catch(e){ return ("#SCL"); }
if (this._roundD)
    { 
    	var pre=Math.abs(z)<1?"0":"";
if (z<0) pre="-"+pre;
z=Math.round(Math.abs(z)*this._roundD).toString();
if (z==0) return 0;
if (this._roundDl>0){
	var n=z.length-this._roundDl;
	if (n<0) {
		z=("000000000"+z).substring(9+n);
		n=0;
	}
	return (pre+z.substring(0,n)+"."+z.substring(n,z.length));
            }
          return pre+z;
      }
    return z;      
}

dhtmlXGridObject.prototype._countTotal=function(row,cell){ 
	var b=0;
	var z=this._h2.get[row];
	for (var i=0; i<z.childs.length; i++){
		if (!z.childs[i].buff) return b;	// dnd of item with childs, item inserted in hierarchy but not fully processed
		if (z.childs[i].buff._parser){
      b = 0;
			this._h2.forEachChild(row,function(el){
				if (el.childs.length==0){
          var value = parseFloat(this._get_cell_value(el.buff,cell),10);
          if (value)
					 b += value;
        }
			},this)
			return b;
		}
    var value = parseFloat(this._get_cell_value(z.childs[i].buff,cell),10);
    if (value)
		  b += value;
	}
	return b;
}

/**
*	@desc: compile pseudo code to correct javascript
*	@param: code - pseudo code
*	@param: cell - math cell
*	@returns: valid js code
*	@type:  private
*   @edition: Professional
*/
dhtmlXGridObject.prototype._compileSCL=function(code,cell,fix){ 
		if (code === null || code === window.undefined) return code;
        code=code.toString();
        if (code.indexOf("=")!=0 || !cell.parentNode) {
	this._reLink([],cell);
	if (fix) cell._code = cell.original = null;
    return code;
}
cell.original=code;

var linked=null;
code=code.replace("=","");
if (code.indexOf("sum")!=-1){ 
code=code.replace("sum","(dhtmlx.agrid._countTotal('"+cell.parentNode.idd+"',"+cell._cellIndex+"))");
if (!this._aggregators) this._aggregators=[];
this._aggregators[cell._cellIndex]="sum";
cell._code=code;
return  this._parsing?"":this._calcSCL(cell);
}
if (code.indexOf("[[")!=-1){
  var test = /(\[\[([^\,]*)\,([^\]]*)]\])/g;
  dhtmlx.agrid=this;
  linked=linked||(new Array());
  code=code.replace(test,
      function ($0,$1,$2,$3){
          if ($2=="-")
          $2=cell.parentNode.idd;
      if ($2.indexOf("#")==0)
          $2=dhtmlx.agrid.getRowId($2.replace("#",""));
          linked[linked.length]=[$2,$3];
      return "(parseFloat(dhtmlx.agrid.cells(\""+$2+"\","+$3+").getValue(),10))";
      }
  );
}

if (code.indexOf(":")!=-1){ 
  var test = /:(\w+)/g;
  dhtmlx.agrid=this;
  var id=cell.parentNode.idd;
  linked=linked||(new Array());
  code=code.replace(test,
      function ($0,$1,$2,$3){
          linked[linked.length]=[id,dhtmlx.agrid.getColIndexById($1)];
          return '(parseFloat(dhtmlx.agrid.cells("'+id+'",dhtmlx.agrid.getColIndexById("'+$1+'")).getValue(),10))';
      }
  );
}
else{
  var test = /c([0-9]+)/g;
  dhtmlx.agrid=this;
  var id=cell.parentNode.idd;
  linked=linked||(new Array());
  code=code.replace(test,
      function ($0,$1,$2,$3){
          linked[linked.length]=[id,$1];
          return "(parseFloat(dhtmlx.agrid.cells(\""+id+"\","+$1+").getValue(),10))";
          }
      );
    }
    
    this._reLink(linked,cell);
    cell._code=code;
    return this._calcSCL(cell);
}

/**
*	@desc: link math cells to it source cells
*	@param: ar - array of nodes for linking
*	@param: cell - math cell
*	@type:  private
*   @edition: Professional
*/
dhtmlXGridObject.prototype._reLink=function(ar,cell){
		if (!ar.length) return; // basically it would be good to clear unused math links, but it will require a symetric structure 
		for (var i=0; i<ar.length; i++){ 
			if (!this._mat_links[ar[i][0]]) this._mat_links[ar[i][0]]={};
			var t=this._mat_links[ar[i][0]];
			if (!t[ar[i][1]]) t[ar[i][1]]=[];
			t[ar[i][1]].push(cell);
		}
}

if (_isKHTML){
// replace callback support for safari.
 (function(){
   var default_replace = String.prototype.replace;
   String.prototype.replace = function(search,replace){
 // replace is not function
 if(typeof replace != "function"){
 return default_replace.apply(this,arguments)
 }
 var str = "" + this;
 var callback = replace;
 // search string is not RegExp
 if(!(search instanceof RegExp)){
 var idx = str.indexOf(search);
 return (
 idx == -1 ? str :
 default_replace.apply(str,[search,callback(search, idx, str)])
 )
 }
 var reg = search;
 var result = [];
 var lastidx = reg.lastIndex;
 var re;
 while((re = reg.exec(str)) != null){
 var idx  = re.index;
 var args = re.concat(idx, str);
 result.push(
 str.slice(lastidx,idx),
 callback.apply(null,args).toString()
 );
 if(!reg.global){
 lastidx += RegExp.lastMatch.length;
 break
 }else{
 lastidx = reg.lastIndex;
 }
 }
 result.push(str.slice(lastidx));
 return result.join("")
   }
 })();
 }

/**
*   @desc: add new column to the grid. Can be used after grid was initialized. At least one column should be in grid
*   @param: ind - index of column
*   @param: header - header content of column
*   @param: type - type of column
*   @param: width - width of column
*   @param: sort - sort type of column
*   @param: align - align of column
*   @param: valign - vertical align of column
*   @param: reserved - not used for now
*   @param: columnColor - background color of column
*   @type: public
*   @edition: Professional
*   @topic: 3
*/
dhtmlXGridObject.prototype.insertColumn=function(ind,header,type,width,sort,align,valign,reserved,columnColor){
	ind=parseInt(ind);
	if (ind>this._cCount) ind=this._cCount;
	if (!this._cMod) this._cMod=this._cCount;
	this._processAllArrays(this._cCount,ind-1,[(header||"&nbsp;"),(width||100),(type||"ed"),(align||"left"),(valign||""),(sort||"na"),(columnColor||""),"",this._cMod,(width||100)]);
this._processAllRows("_addColInRow",ind);

if (typeof(header)=="object")
for (var i=1; i < this.hdr.rows.length; i++) {
	if (header[i-1]=="#rspan"){
	var pind=i-1;
	var found=false;
	var pz=null;
	while(!found){
		var pz=this.hdr.rows[pind];
		for (var j=0; j<pz.cells.length; j++)
   			if (pz.cells[j]._cellIndex==ind) {
      			found=j;
      			break;
  		}
		pind--;
	}
this.hdr.rows[pind+1].cells[j].rowSpan=(this.hdr.rows[pind].cells[j].rowSpan||1)+1;
}
else				
this.setHeaderCol(ind,(header[i-1]||"&nbsp;"),i);
	}
else
	this.setHeaderCol(ind,(header||"&nbsp;"));
	this.hdr.rows[0].cells[ind]
	this._cCount++;
	this._cMod++;
	this._master_row=null;
	this.setSizes();
}
/**
*   @desc: delete column
*   @param: ind - index of column
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.deleteColumn=function(ind){
	ind=parseInt(ind);
	if (this._cCount==0) return;
	if (!this._cMod) this._cMod=this._cCount;
	if (ind>=this._cCount) return;
	this._processAllArrays(ind,this._cCount-1,[null,null,null,null,null,null,null,null,null,null,null]);
	this._processAllRows("_deleteColInRow",ind);
	this._cCount--;
	this._master_row=null;
	this.setSizes();

}

/**
*   @desc: call method for all rows in all collections
*   @type: private
*   @topic: 0
*/
dhtmlXGridObject.prototype._processAllRows = function(method,oldInd,newInd){
	this[method](this.obj.rows[0],oldInd,newInd,0);

	var z=this.hdr.rows.length;
    for (var i=0; i<z; i++)
		this[method](this.hdr.rows[i],oldInd,newInd,i);
		
	if (this.ftr){
		var z=this.ftr.firstChild.rows.length;
	    for (var i=0; i<z; i++)
			this[method](this.ftr.firstChild.rows[i],oldInd,newInd,i);
	}

	this.forEachRow(function(id){
		if (this.rowsAr[id] && this.rowsAr[id].tagName=="TR")
			this[method](this.rowsAr[id],oldInd,newInd,-1);
	});			
	
}

/**
*   @desc: shift data in all arrays
*   @type: private
*   @topic: 0
*/
dhtmlXGridObject.prototype._processAllArrays = function(oldInd,newInd,vals){
	var ars=["hdrLabels","initCellWidth","cellType","cellAlign","cellVAlign","fldSort","columnColor","_hrrar","_c_order"];
if (this.cellWidthPX.length) ars.push("cellWidthPX");
if (this.cellWidthPC.length) ars.push("cellWidthPC");
if (this._col_combos) ars.push("_col_combos");
if (this._mCols) ars[ars.length]="_mCols";
if (this.columnIds) ars[ars.length]="columnIds";
if (this._maskArr) ars.push("_maskArr");
if (this._drsclmW) ars.push("_drsclmW");
if (this._RaSeCol) ars.push("_RaSeCol");
if (this._hm_config) ars.push("_hm_config");
if (this._drsclmn) ars.push("_drsclmn");

if (this.clists) ars.push("clists");
if (this._validators && this._validators.data) ars.push(this._validators.data);

ars.push("combos");
if (this._customSorts) ars.push("_customSorts");
if (this._aggregators)  ars.push("_aggregators");
    var mode=(oldInd<=newInd);

	if (!this._c_order) {
		this._c_order=new Array();
		var l=this._cCount;
		for (var i=0; i<l; i++)
			this._c_order[i]=i;
	}

	for (var i=0; i<ars.length; i++)
		{
			var t=this[ars[i]]||ars[i];
			if (t){
				if (mode){
					var val=t[oldInd];
					for (var j=oldInd; j<newInd; j++)
						t[j]=t[j+1];
					t[newInd]=val;
				} else {
					var val=t[oldInd];
					for (var j=oldInd; j>(newInd+1); j--)
						t[j]=t[j-1];
					t[newInd+1]=val;
				}
				if (vals)
					t[newInd+(mode?0:1)]=vals[i];
			}
		}
}


/**
*   @desc: moves column of specified index to new position
*   @param: oldInd - current index of column
*   @param: newInd - new index of column
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.moveColumn = function(oldInd,newInd){
	newInd--;
    oldInd=parseInt(oldInd); newInd=parseInt(newInd);
	if (newInd<oldInd) var tInd=newInd+1;
	else var tInd=newInd;
	

	if (!this.callEvent("onBeforeCMove",[oldInd,tInd]))  return false;
if (oldInd==tInd) return;


//replace data
this.editStop();
this._processAllRows("_moveColInRow",oldInd,newInd);
this._processAllArrays(oldInd,newInd);

//sorting image
	if (this.fldSorted)
		this.setSortImgPos(this.fldSorted._cellIndex);

  /*	for (var i=0; i<this.hdrLabels.length; i++)
this._c_revers[this._c_order[i]]=i;*/
this.callEvent("onAfterCMove",[oldInd,tInd]);
};


/**
*   @desc: swap columns in collection
*   @param: cols - collection of collumns
*   @type: private
*   @topic: 0
*/
dhtmlXGridObject.prototype._swapColumns = function(cols){
	var z=new Array();
	for (var i=0; i<this._cCount; i++){
		var n=cols[this._c_order[i]];
		if (typeof(n)=="undefined") n="";
		z[i]=n;
		}
	return z;
}

/**
*   @desc: move data in the row
*   @param: row - row object
*   @param: oldInd - current index of column
*   @param: newInd - new index of column
*   @type: private
*   @topic: 0
*/
dhtmlXGridObject.prototype._moveColInRow = function(row,oldInd,newInd){


	var c=row.childNodes[oldInd];
	var ci=row.childNodes[newInd+1];
	if (!c) return;
	if (ci)
		row.insertBefore(c,ci);
	else
		row.appendChild(c);

	for (var i=0; i<row.childNodes.length; i++)
		row.childNodes[i]._cellIndex=row.childNodes[i]._cellIndexS=i;

};
/**
*   @desc: add column in row
*   @param: row - row object
*   @param: ind - current index of column
*   @type: private
*   @topic: 0
*/
dhtmlXGridObject.prototype._addColInRow = function(row,ind,old,mod){
	var cind=ind;
	if (row._childIndexes){
		if (row._childIndexes[ind-1]==row._childIndexes[ind] || !row.childNodes[row._childIndexes[ind-1]]){
			for (var i=row._childIndexes.length; i>=ind; i--)
			row._childIndexes[i]=i?(row._childIndexes[i-1]+1):0;
			row._childIndexes[ind]--;
			}
		else
		for (var i = row._childIndexes.length; i >= ind; i--)
			row._childIndexes[i]=i?(row._childIndexes[i-1]+1):0;
		var cind=row._childIndexes[ind];
	}
	var c=row.childNodes[cind];
	var z=document.createElement((mod)?"TD":"TH");
if (mod) { z._attrs={}; } //necessary for code compressor
else z.style.width=(parseInt(this.cellWidthPX[ind])||"100")+"px";
if (c)
	row.insertBefore(z,c);
else
	row.appendChild(z);

if (this.dragAndDropOff && row.idd) this.dragger.addDraggableItem(row.childNodes[cind],this);

for (var i=cind+1; i<row.childNodes.length; i++){
	row.childNodes[i]._cellIndex=row.childNodes[i]._cellIndexS=row.childNodes[i]._cellIndex+1;
}
	
if (row.childNodes[cind]) row.childNodes[cind]._cellIndex=row.childNodes[cind]._cellIndexS=ind;

if (row.idd || typeof(row.idd)!="undefined"){
this.cells3(row,ind).setValue("");
	z.align=this.cellAlign[ind];
	z.style.verticalAlign=this.cellVAlign[ind];
	z.bgColor=this.columnColor[ind];
	}
else if (z.tagName=="TD"){
if (!row.idd && this.forceDivInHeader) z.innerHTML="<div class='hdrcell'>&nbsp;</div>";
else	z.innerHTML="&nbsp;";
	} 
};
/**
*   @desc: delete columns from row
*   @param: row - row object
*   @param: ind - current index of column
*   @type: private
*   @topic: 0
*/
dhtmlXGridObject.prototype._deleteColInRow = function(row,ind){
	var aind = ind; //logical index
	if (row._childIndexes) ind=row._childIndexes[ind];
	var c=row.childNodes[ind];
	if (!c) return;
	if (c.colSpan && c.colSpan>1 && c.parentNode.idd){
		var t=c.colSpan-1;
		var v=this.cells4(c).getValue();
		this.setColspan(c.parentNode.idd,c._cellIndex,1)
		if (t>1){
			var cind=c._cellIndex*1;
			this.setColspan(c.parentNode.idd,cind+1,t)
			this.cells(c.parentNode.idd,c._cellIndex*1+1).setValue(v)
			row._childIndexes.splice(cind,1)
			for (var i=cind; i < row._childIndexes.length; i++) 
				row._childIndexes[i]-=1;
				
		}
	} else if (row._childIndexes){
	    row._childIndexes.splice(aind,1);
	    for (var i=aind; i<row._childIndexes.length; i++) row._childIndexes[i]--;
	}
	if (c)
		row.removeChild(c);

	for (var i=ind; i<row.childNodes.length; i++)
		row.childNodes[i]._cellIndex=row.childNodes[i]._cellIndexS=row.childNodes[i]._cellIndex-1;
};


/**
*   @desc: enable move column functionality
*   @param: mode - true/false
*   @param: columns - list of true/false values, optional
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableColumnMove = function(mode,columns){
	this._mCol=dhx4.s2b(mode);
	if (typeof(columns)!="undefined")
this._mCols=columns.split(",");
if (!this._mmevTrue){
	dhtmlxEvent(this.hdr,"mousedown",this._startColumnMove);
dhtmlxEvent(document.body,"mousemove",this._onColumnMove);
dhtmlxEvent(document.body,"mouseup",this._stopColumnMove);
		this._mmevTrue=true;
	}
};

dhtmlXGridObject.prototype._startColumnMove = function(e){
	e=e||event;
	var el = e.target||e.srcElement;
//		var grid=globalActiveDHTMLGridObject;
var zel=el;
while(zel.tagName!="TABLE") zel=zel.parentNode;
var grid=zel.grid;
if (!grid) return; //somehow grid not found
	grid.setActive();
if (!grid._mCol || e.button==2) return;

el = grid.getFirstParentOfType(el,"TD")
if(el.style.cursor!="default") return true;
if ((grid)&&(!grid._colInMove)){
	grid.resized = null;
	if ((!grid._mCols)||(grid._mCols[el._cellIndex]=="true"))
	    	grid._colInMove=el._cellIndex+1;
	}
	grid._colInMovePos = {
		x: e.clientX, y: e.clientY
	};
	return true;
};
dhtmlXGridObject.prototype._onColumnMove = function(e){
	e=e||event;
	var grid=window.globalActiveDHTMLGridObject;
	if ((grid)&&(grid._colInMove)){
		var diff = Math.max(
			Math.abs(e.clientX - grid._colInMovePos.x),
			Math.abs(e.clientY - grid._colInMovePos.y)
		);
		if (diff < 20) return;


		if (grid._hideHContext) grid._hideHContext();
    	if (typeof(grid._colInMove)!="object"){
var z=document.createElement("DIV");
z._aIndex=(grid._colInMove-1);
z._bIndex=null;
z.innerHTML=grid.getHeaderCol(z._aIndex);
z.className="dhx_dragColDiv";
z.style.position="absolute";
	document.body.appendChild(z);
    grid._colInMove=z;
}

var cor=[];
cor[0]=(document.body.scrollLeft||document.documentElement.scrollLeft);
cor[1]=(document.body.scrollTop||document.documentElement.scrollTop);


grid._colInMove.style.left=e.clientX+cor[0]+8+"px";
grid._colInMove.style.top=e.clientY+cor[1]+8+"px";

var el = e.target||e.srcElement;
while ((el)&&(typeof(el._cellIndexS)=="undefined"))
	el=el.parentNode;

if (grid._colInMove._oldHe){
	grid._colInMove._oldHe.className=grid._colInMove._oldHe.className.replace(/columnTarget(L|R)/g,"");
	grid._colInMove._oldHe=null;
	grid._colInMove._bIndex=null;
	}
if (el) {
	if (grid.hdr.rows[1]._childIndexes)
		var he=grid.hdr.rows[1].cells[grid.hdr.rows[1]._childIndexes[el._cellIndexS]];
	else
		var he=grid.hdr.rows[1].cells[el._cellIndexS];
	var z=e.clientX-(dhx4.absLeft(he)-grid.hdrBox.scrollLeft);
    if (z/he.offsetWidth>0.5){
		he.className+=" columnTargetR";
	grid._colInMove._bIndex=el._cellIndexS;
	}
else {
	he.className+=" columnTargetL";
		grid._colInMove._bIndex=el._cellIndexS-1;
	}
	if (he.offsetLeft<(grid.objBox.scrollLeft+20))
		grid.objBox.scrollLeft=Math.max(0,he.offsetLeft-20);

	if ((he.offsetLeft+he.offsetWidth-grid.objBox.scrollLeft)>(grid.objBox.offsetWidth-20))
		grid.objBox.scrollLeft=Math.min(grid.objBox.scrollLeft+he.offsetWidth+20,grid.objBox.scrollWidth-grid.objBox.offsetWidth);	
		
    grid._colInMove._oldHe=he;
}
//prevent selection, or other similar reactions while column draged
		e.cancelBubble = true;  
        return false;  
	}
	return true;
};
dhtmlXGridObject.prototype._stopColumnMove = function(e){
	e=e||event;
	var grid=window.globalActiveDHTMLGridObject;
	if ((grid)&&(grid._colInMove)){
		if (typeof(grid._colInMove)=="object"){
grid._colInMove.parentNode.removeChild(grid._colInMove);
if (grid._colInMove._bIndex!=null)
	grid.moveColumn(grid._colInMove._aIndex,grid._colInMove._bIndex+1);

if (grid._colInMove._oldHe)
	grid._colInMove._oldHe.className=grid._colInMove._oldHe.className.replace(/columnTarget(L|R)/g,"");
			grid._colInMove._oldHe=null;
			grid._colInMove.grid=null;
			grid.resized = true;
			}
        grid._colInMove=0;
	}
	return true;
};


/**
*   @desc: load grid from CSV file
*   @param: path - path to file
*   @param: afterCall - function which will be called after xml loading
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.loadCSVFile = function(path,afterCall){
    this.load(path,afterCall,"csv")
}

/**
*   @desc: enable mode, where ID for rows loaded from CSV autogenerated
*   @param: mode - true/false
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableCSVAutoID = function(mode){
   this._csvAID=dhx4.s2b(mode);
}
/**
*   @desc: enable recognizing first row in CSV as header
*   @param: mode - true/false
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableCSVHeader = function(mode){
   this._csvHdr=dhx4.s2b(mode);
}

/**
*   @desc: load grid from CSV string
*   @param: str - delimer used in CSV operations, comma by default ( only single char delimeters allowed )
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.setCSVDelimiter = function(str){
   this.csv.cell=str;
}
dhtmlXGridObject.prototype._csvAID = true;

/**
*   @desc: load grid from CSV string
*   @param: str - CSV  string
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.loadCSVString = function(str){
   this.parse(str,"csv")
}

/**
*   @desc: serialize to CSV string
*   @type: public
*	@param: text only - force serialization of text values ( skip HTML elements ) )
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.serializeToCSV = function(textmode){ 
    this.editStop()
    if (this._mathSerialization)
         this._agetm="getMathValue";
else if (this._strictText || textmode)
	this._agetm="getTitle";
else this._agetm="getValue";

var out=[];
if (this._csvHdr){
	for (var j=1; j < this.hdr.rows.length; j++) {
		var a=[]; 
		for (var i=0; i<this._cCount; i++)
			if ((!this._srClmn)||(this._srClmn[i]))
				a.push(this.getColumnLabel(i,j-1));
		out.push(this.csvParser.str(a,this.csv.cell, this.csv.row));
	}
}


//rows collection
    var i=0;
    var leni=this.rowsBuffer.length;

   for(i; i<leni; i++){
		var temp=this._serializeRowToCVS(null,i)      	
		if (temp!="") out.push(temp);
  }

   return this.csvParser.block(out,this.csv.row);
}

/**
*   @desc: serialize TR to CSV
*   @param: r - TR or xml node (row)
*   @retruns: string - CSV representation of passed row
*   @type: private
*/
dhtmlXGridObject.prototype._serializeRowToCVS = function(r,i,start,end){
    var out = new Array();
    if (!r){
	    r=this.render_row(i)
	    if (this._fake && !this._fake.rowsAr[r.idd]) this._fake.render_row(i);
	}
    

    if (!this._csvAID)
       out[out.length]=r.idd;

	start = start||0;
	
    end = end||this._cCount;
    //cells
var changeFl=false;
var ind=start;
//rowspans before block selection
while (r.childNodes[start]._cellIndex>ind && start) start--; 


for(var jj=start;ind<end;jj++){
	if (!r.childNodes[jj]) break;
	var real_ind=r.childNodes[jj]._cellIndex;
    if (((!this._srClmn)||(this._srClmn[real_ind])) && (!this._serialize_visible || !this._hrrar[real_ind])){
        var cvx=r.childNodes[jj];

        var zx=this.cells(r.idd,real_ind);
        while (ind!=real_ind){
        	ind++;
        	out.push("")
	if (ind>=end) break;
}
if (ind>=end) break;
ind++;
/*	if (zx.getText)
		zxVal=zx.getText();
	else*/
if (zx.cell)
	zxVal=zx[this._agetm]();
else zxVal="";


if ((this._chAttr)&&(zx.wasChanged()))
	changeFl=true;

    out[out.length]=((zxVal===null)?"":zxVal)
//#colspan:20092006{
if ( this._ecspn && cvx.colSpan && cvx.colSpan >1 ){
    cvx=cvx.colSpan-1;
    for (var u=0; u<cvx; u++){
        out[out.length] = "";
        ind++;
    }
}
//#}

 } else ind++;
    }
     if ((this._onlChAttr)&&(!changeFl)) return "";
      return this.csvParser.str(out,this.csv.cell, this.csv.row);
}

dhtmlXGridObject.prototype.toClipBoard=function(val){
    if (window.clipboardData)
      window.clipboardData.setData("Text",val);
   else
      (new Clipboard()).copy(val);

}
dhtmlXGridObject.prototype.fromClipBoard=function(){
   if (window.clipboardData)
      return window.clipboardData.getData("Text");
   else
      return (new Clipboard()).paste();
}

/**
*   @desc: copy value of cell to clipboard
*   @type: public
*   @param: rowId - id of row (optional, use selected row by default)
*   @param: cellInd - column index(optional, use selected cell by default)
*     @edition: Professional
*   @topic: 5
*/
dhtmlXGridObject.prototype.cellToClipboard = function(rowId,cellInd){
    if ((!rowId)||(!cellInd && cellInd !== 0)){
       if (!this.selectedRows[0]) return;
       rowId=this.selectedRows[0].idd;
       cellInd=this.cell._cellIndex;
   }
   
   	var ed=this.cells(rowId,cellInd);
    this.toClipBoard(((ed.getLabel?ed.getLabel():ed.getValue())||"").toString());
}

/**
*   @desc: set value of cell from clipboard
*   @type: public
*     @edition: Professional
*   @param: rowId - id of row (optional, use selected row by default)
*   @param: cellInd - column index(optional, use selected cell by default)
*   @topic: 5
*/
dhtmlXGridObject.prototype.updateCellFromClipboard = function(rowId,cellInd){
    if ((!rowId)||(!cellInd)){
       if (!this.selectedRows[0]) return;
       rowId=this.selectedRows[0].idd;
       cellInd=this.cell._cellIndex;
   }
   	var ed=this.cells(rowId,cellInd);
    ed[ed.setImage?"setLabel":"setValue"](this.fromClipBoard());
}

/**
*   @desc: copy value of row to clipboard
*   @type: public
*     @edition: Professional
*   @param: rowId - id of row (optional, use selected row by default)
*   @topic: 5
*/
dhtmlXGridObject.prototype.rowToClipboard = function(rowId){
	var out="";
if (this._mathSerialization)
	this._agetm="getMathValue";
else if (this._strictText)
	this._agetm="getTitle";
else 
	this._agetm="getValue";
    
  this._serialize_visible = !this._fake;

	if (rowId)
		out=this._serializeRowToCVS(this.getRowById(rowId));
	else {
   		var data = [];
		for (var i=0; i<this.selectedRows.length; i++){
			data[data.length] = this._serializeRowToCVS(this.selectedRows[i]);
			out = this.csvParser.block(data, this.csv.row);
		}
	}

  this._serialize_visible = false;
	this.toClipBoard(out);
}

/**
*   @desc: set value of row from clipboard
*   @type: public
*     @edition: Professional
*   @param: rowId - id of row (optional, use selected row by default)
*   @topic: 5
*/
dhtmlXGridObject.prototype.updateRowFromClipboard = function(rowId){
	var csv=this.fromClipBoard();
	if (!csv) return;
	if (rowId)
		var r=this.getRowById(rowId);
	else
		var r=this.selectedRows[0];
	if (!r) return;
	
	var parser = this.csvParser;
	csv=parser.unblock(csv,this.csv.cell, this.csv.row)[0];
	if (!this._csvAID) csv.splice(0,1);
	for (var i=0; i<csv.length; i++){
		var ed=this.cells3(r,i);
		ed[ed.setImage?"setLabel":"setValue"](csv[i]);
	}
}

dhtmlXGridObject.prototype.csvParser={
	block:function(data,row){
		return data.join(row);
	},
	unblock:function(str,cell,row){
		var data = (str||"").split(row);	
for (var i=0; i < data.length; i++)
	data[i]=(data[i]||"").split(cell);
var last = data.length-1;
if (data[last].length == 1 && data[last][0]=="")
      data.splice(last,1);
		return data;
	},
	str:function(data,cell,row){
		return data.join(cell);
	}
};
dhtmlXGridObject.prototype.csvExtParser={
	_quote:RegExp('"',"g"),
_quote_esc:RegExp("\"\"","g"),
block:function(data,row){
	return data.join(row);
},
unblock:function(str,cell,row){ 
	var out = [[]];
	var ind = 0;
	if (!str) return out;

	var quote_start = /^[ ]*"/;
var quote_end   = /"[ ]*$/;
var row_exp  = new RegExp(".*"+row+".*$");

var data = str.split(cell);
for (var i=0; i<data.length; i++){
	if (data[i].match(quote_start)){
		var buff = data[i].replace(quote_start, "");
	while (!data[i].match(quote_end)) {
		i++;
		buff+=data[i];
	}
	out[ind].push(buff.replace(quote_end, "").replace(this._quote_esc,'"'));
		} else if (data[i].match(row_exp)){
    var row_pos = data[i].indexOf(row);
			out[ind].push(data[i].substr(0, row_pos));
			ind++;
			out[ind] = [];
			data[i]=data[i].substr(row_pos+1); i--;
		} else {
			if (data[i] || i!=data.length-1)
				out[ind].push(data[i]);
		}
	}

var last = out.length-1;
if (last>0 && !out[last].length)
  out.splice(last,1);

	return out;	
},
str:function(data,cell,row){
	for (var i=0; i < data.length; i++)
		data[i] = '"'+data[i].replace(this._quote, "\"\"")+'"';
		return data.join(cell);
	}
};

/**
*   @desc: add new row from clipboard
*   @type: public
*     @edition: Professional
*   @topic: 5
*/
dhtmlXGridObject.prototype.addRowFromClipboard = function(){
   var csv=this.fromClipBoard();
   if (!csv) return;
   var z=this.csvParser.unblock(csv, this.csv.cell, this.csv.row);
   for (var i=0; i<z.length; i++)
      if (z[i]){
         csv=z[i];
         if (!csv.length) continue;
         if (this._csvAID)
         	this.addRow(this.getRowsNum()+2,csv);
         else{
         	if (this.rowsAr[csv[0]])
         		csv[0]=this.uid();
         	this.addRow(csv[0],csv.slice(1));
     		}
      }
}

/**
*   @desc: copy grid in CSV to clipboard
*   @type: public
*     @edition: Professional
*   @topic: 5
*/
dhtmlXGridObject.prototype.gridToClipboard = function(){
   this.toClipBoard(this.serializeToCSV());
}

/**
*   @desc: init grid from CSV stored in clipboard
*   @type: public
*     @edition: Professional
*   @topic: 5
*/
dhtmlXGridObject.prototype.gridFromClipboard = function(){
   var csv=this.fromClipBoard();
   if (!csv) return;
   this.loadCSVString(csv);
}

/**
*   @desc: get grid as XML - php required
*   @param: path - path to server side code,optional
*   @type: private
*   @edition: Professional
*   @topic: 5
*/
dhtmlXGridObject.prototype.getXLS = function(path){
   if (!this.xslform){
      this.xslform=document.createElement("FORM");
  this.xslform.action=(path||"")+"xls.php";
  this.xslform.method="post";
  this.xslform.target=(_isIE?"_blank":"");
  document.body.appendChild(this.xslform);
  var i1=document.createElement("INPUT");
  i1.type="hidden";
  i1.name="csv";
  this.xslform.appendChild(i1);
  var i2=document.createElement("INPUT");
  i2.type="hidden";
  i2.name="csv_header";
      this.xslform.appendChild(i2);
   }
      var cvs = this.serializeToCSV();
      this.xslform.childNodes[0].value = cvs;
        var cvs_header = [];
        var l = this._cCount;
        for (var i=0; i<l; i++) {
         cvs_header.push(this.getHeaderCol(i));
        }
      cvs_header = cvs_header.join(',');
      this.xslform.childNodes[1].value = cvs_header;
       this.xslform.submit();
}

/**
*   @desc: generate print friendly view
*   @type: public
*   @edition: Professional
*   @topic: 5
*/
dhtmlXGridObject.prototype.printView = function(before,after){
	  var html="<style>TD { text-align:center; padding-left:2px;padding-right:2px; } \n td.filter input, td.filter select { display:none; }	\n  </style>";
  var st_hr=null;
  if (this._fake) {
  	st_hr=[].concat(this._hrrar); 
  	for (var i=0; i<this._fake._cCount; i++)
  		this._hrrar[i]=null;
  }
 var port = document.location.port;
 var hostname = document.location.hostname;
   html+="<base  href='"+(document.location.protocol+"//"+hostname+(port?(":"+port):"")+document.location.pathname)+"'></base>";
   if (!this.parentGrid) html+=(before||"");
   html += '<table width="100%" border="2px" cellpadding="0" cellspacing="0">';
   var row_length = Math.max(this.rowsBuffer.length,this.rowsCol.length); //paging and smartrendering
   var col_length = this._cCount;
  var width = this._printWidth();
  html += '<tr class="header_row_1">';
for (var i=0; i<col_length; i++){
	if (this._hrrar && this._hrrar[i]) continue;
 var hcell=this.hdr.rows[1].cells[this.hdr.rows[1]._childIndexes?this.hdr.rows[1]._childIndexes[parseInt(i)]:i];
 var colspan=(hcell.colSpan||1);
 var rowspan=(hcell.rowSpan||1);
 
 for (var j=1; j<colspan; j++)
 	width[i]+=width[j];
html += '<td rowspan="'+rowspan+'" width="'+width[i]+'%" style="background-color:lightgrey;" colspan="'+colspan+'">'+this.getHeaderCol(i)+'</td>';
     i+=colspan-1;
    }
  html += '</tr>';

for (var i=2; i<this.hdr.rows.length; i++){
	if (_isIE){
		html+="<tr style='background-color:lightgrey' class='header_row_"+i+"'>";
	var cells=this.hdr.rows[i].childNodes;
	for (var j=0; j < cells.length; j++) 
		if (!this._hrrar || !this._hrrar[cells[j]._cellIndex]){
			html+=cells[j].outerHTML;
		}
	html+="</tr>";
	}
else
	html+="<tr class='header_row_"+i+"' style='background-color:lightgrey'>"+(this._fake?this._fake.hdr.rows[i].innerHTML:"")+this.hdr.rows[i].innerHTML+"</tr>";
	}

   for (var i=0; i<row_length; i++) {
     html += '<tr>';
   if (this.rowsCol[i] && this.rowsCol[i]._cntr){
   	  html+=this.rowsCol[i].innerHTML.replace(/<img[^>]*>/gi,"")+'</tr>';
   	  continue;
   }
   if (this.rowsCol[i] && this.rowsCol[i].style.display=="none") continue;
   
   var row_id
   if (this.rowsCol[i])
   		row_id=this.rowsCol[i].idd;
   	else if (this.rowsBuffer[i]) 
   		row_id=this.rowsBuffer[i].idd;
   	else continue; //dyn loading 
   	
   for (var j=0; j<col_length; j++) {
   	   if (this._hrrar && this._hrrar[j]) continue;
   	   if(this.rowsAr[row_id] && this.rowsAr[row_id].tagName=="TR") {
   	   var c=this.cells(row_id, j);
   	   if (c._setState) var value="";
   	   else if (c.getContent) value = c.getContent();
   	   else if (c.getImage || c.combo) var value=c.cell.innerHTML;
   	   /*else var value = c.getValue();*/
   	   /*HSITX*/
   	   else value = c.getValue(true);
   	   /**/
   } else 
   	  var value=this._get_cell_value(this.rowsBuffer[i],j);
	   /*HSITX*/
   	   if(typeof(value) === "undefined"){
   		   var cell = this.cells(this.rowsBuffer[i].idd, j);
   		   value	= cell.getValue(true);  
   	   }
	   /**/
   var color = this.columnColor[j]?'background-color:'+this.columnColor[j]+';':'';
var align = this.cellAlign[j]?'text-align:'+this.cellAlign[j]+';':'';
var cspan =  c.getAttribute("colspan");
html += '<td style="'+color+align+'" '+(cspan?'colSpan="'+cspan+'"':'')+'>'+(value===""?"&nbsp;":value)+'</td>';
    if (cspan) j+=cspan-1;
   }
 html += '</tr>';
 if (this.rowsCol[i] && this.rowsCol[i]._expanded){
 	 var sub=this.cells4(this.rowsCol[i]._expanded.ctrl);
 	 if (sub.getSubGrid)
 	 	html += '<tr><td colspan="'+col_length+'">'+sub.getSubGrid().printView()+'</td></tr>';
 else
 	html += '<tr><td colspan="'+col_length+'">'+this.rowsCol[i]._expanded.innerHTML+'</td></tr>';
     }
   }

   if (this.ftr)
  	for (var i=1; i<this.ftr.childNodes[0].rows.length; i++)
  		html+="<tr style='background-color:lightgrey'>"+((this._fake)?this._fake.ftr.childNodes[0].rows[i].innerHTML:"")+this.ftr.childNodes[0].rows[i].innerHTML+"</tr>";
    		

  html += '</table>';
  if (this.parentGrid) return html;
  
  html+=(after||"");
  
  /*var d = window.open('', '_blank');*/
  /*HSITX*/
  var d = window.open("", "_blank", "status=no,scrollbars=yes,resizable=yes");
  /**/
  
  d.document.write(html);
  d.document.write("<script>window.onerror=function(){return true;}</script>");
      d.document.close();
      if (this._fake) {
	  	this._hrrar=st_hr;
	  }
}
dhtmlXGridObject.prototype._printWidth=function(){
      var width = [];
      var total_width = 0;
      for (var i=0; i<this._cCount; i++) {
         var w = this.getColWidth(i);
         width.push(w);
         total_width += w;
      }
      var percent_width = [];
      var total_percent_width = 0;
      for (var i=0; i<width.length; i++) {
         var p = Math.floor((width[i]/total_width)*100);
         total_percent_width += p;
            percent_width.push(p);
      }
      percent_width[percent_width.length-1] += 100-total_percent_width;
      return percent_width;
}

dhtmlXGridObject.prototype.mouseOverHeader=function(func){
	var self=this;
	dhtmlxEvent(this.hdr,"mousemove",function(e){
			e=e||window.event;
			var el=e.target||e.srcElement;
        	if(el.tagName!="TD")
            	el = self.getFirstParentOfType(el,"TD")				
            if (el && (typeof(el._cellIndex)!="undefined"))
				func(el.parentNode.rowIndex,el._cellIndex);
	});
}
dhtmlXGridObject.prototype.mouseOver=function(func){
	var self=this;	
	dhtmlxEvent(this.obj,"mousemove",function(e){
			e=e||window.event;
			var el=e.target||e.srcElement;
        	if(el.tagName!="TD")
            	el = self.getFirstParentOfType(el,"TD")				
            if (el && (typeof(el._cellIndex)!="undefined"))
				func(el.parentNode.rowIndex,el._cellIndex);
	});
}

/**
*  @desc: enable smart paging mode
*  @type: public
*  @param: fl - true|false - enable|disable mode
*  @param: pageSize - count of rows per page
*  @param: pagesInGrp - count of visible page selectors
*  @param: parentObj - ID or container which will be used for showing paging controls
*  @param: showRecInfo - true|false - enable|disable showing of additional info about paging state
*  @param: recInfoParentObj - ID or container which will be used for showing paging state
*  @edition: Professional
*  @topic: 0
*/
dhtmlXGridObject.prototype.enablePaging = function(fl,pageSize,pagesInGrp,parentObj,showRecInfo,recInfoParentObj){
	this._pgn_parentObj = typeof(parentObj)=="string" ? document.getElementById(parentObj) : parentObj;
	this._pgn_recInfoParentObj = typeof(recInfoParentObj)=="string" ? document.getElementById(recInfoParentObj) : recInfoParentObj;
	
	this.pagingOn = fl;
	this.showRecInfo = showRecInfo;
	this.rowsBufferOutSize = parseInt(pageSize);
	this.currentPage = 1;
	this.pagesInGroup = parseInt(pagesInGrp);
	this._init_pgn_events()
	this.setPagingSkin("default");
}
/**
*  @desc: allow to configure settings of dynamical paging
*  @type: public
*  @param: filePath - path which will be used for requesting data ( parth from load command used by default )
*  @param: buffer -  count of rows requrested from server by single operation, optional
*  @edition: Professional
*  @topic: 0
*/
dhtmlXGridObject.prototype.setXMLAutoLoading = function(filePath,bufferSize){
	this.xmlFileUrl = filePath;
	this._dpref = bufferSize;
}
/**
*  @desc: change current page in grid
*  @type: public
*  @param: ind - correction ( -1,1,2  etc) to current active page
*  @edition: Professional
*  @topic: 0
*/
dhtmlXGridObject.prototype.changePageRelative = function(ind){ 
	this.changePage(this.currentPage+ind);
}
/**
*  @desc: change current page in grid
*  @type: public
*  @param: pageNum -  new active page
*  @edition: Professional
*  @topic: 0
*/
dhtmlXGridObject.prototype.changePage = function(pageNum){ 
	if (arguments.length==0) pageNum=this.currentPage||0;
	pageNum=parseInt(pageNum);
	pageNum=Math.max(1,Math.min(pageNum,Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize)));
	
	if(!this.callEvent("onBeforePageChanged",[this.currentPage,pageNum]))
		return;
	
	this.currentPage = parseInt(pageNum);
	this._reset_view();
	this._fixAlterCss();			
	this.callEvent("onPageChanged",this.getStateOfView());
}
/**
*  @desc: allows to set custom paging skin
*  @param: name - skin name (default,toolbar,bricks)
*  @type:  public
*/
dhtmlXGridObject.prototype.setPagingSkin = function(name){
	this._pgn_skin=this["_pgn_"+name];
	if (name=="toolbar") this._pgn_skin_tlb=arguments[1];
}
/**
*  @desc: allows to set paging templates for default skin
*  @param: a - template for zone A
*  @param: b - template for zone B
*  @type:  public
*/
dhtmlXGridObject.prototype.setPagingTemplates = function(a,b){
	this._pgn_templateA=this._pgn_template_compile(a);
	this._pgn_templateB=this._pgn_template_compile(b);
	this._page_skin_update();
}
dhtmlXGridObject.prototype._page_skin_update = function(name){
	if (!this.pagesInGroup) this.pagesInGroup=Math.ceil(Math.min(5,this.rowsBuffer.length/this.rowsBufferOutSize));
	var totalPages=Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize);
	if (totalPages && totalPages<this.currentPage)
		return this.changePage(totalPages);
	if (this.pagingOn && this._pgn_skin) this._pgn_skin.apply(this,this.getStateOfView());
}
dhtmlXGridObject.prototype._init_pgn_events = function(name){
	this.attachEvent("onXLE",this._page_skin_update)
	this.attachEvent("onClearAll",this._page_skin_update)
	this.attachEvent("onPageChanged",this._page_skin_update)
	this.attachEvent("onGridReconstructed",this._page_skin_update)
	
	this._init_pgn_events=function(){};
}

// default paging
dhtmlXGridObject.prototype._pgn_default=function(page,start,end){
	if (!this.pagingBlock){
		this.pagingBlock = document.createElement("DIV");
		this.pagingBlock.className = "pagingBlock";
		this.recordInfoBlock = document.createElement("SPAN");
		this.recordInfoBlock.className = "recordsInfoBlock";
		if (!this._pgn_parentObj) return;
		this._pgn_parentObj.appendChild(this.pagingBlock)
		if(this._pgn_recInfoParentObj && this.showRecInfo)
			this._pgn_recInfoParentObj.appendChild(this.recordInfoBlock)
		
		//this._pgn_template="{prev:} {current:-1},{current},{current:+1} {next:>}"
		if (!this._pgn_templateA){
			this._pgn_templateA=this._pgn_template_compile("[prevpages:&lt;:&nbsp;] [currentpages:,&nbsp;] [nextpages:&gt;:&nbsp;]");
			this._pgn_templateB=this._pgn_template_compile("Results <b>[from]-[to]</b> of <b>[total]</b>");
		}
	}
	
	var details=this.getStateOfView();
	this.pagingBlock.innerHTML = this._pgn_templateA.apply(this,details);
	this.recordInfoBlock.innerHTML = this._pgn_templateB.apply(this,details);
	this._pgn_template_active(this.pagingBlock);
	this._pgn_template_active(this.recordInfoBlock);
	
	this.callEvent("onPaging",[]);
}

dhtmlXGridObject.prototype._pgn_block=function(sep){ 
	var start=Math.floor((this.currentPage-1)/this.pagesInGroup)*this.pagesInGroup;
	var max=Math.min(Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize),start+this.pagesInGroup);
	var str=[];
	for (var i=start+1; i<=max; i++)
		if (i==this.currentPage)
		str.push("<a class='dhx_not_active'><b>"+i+"</b></a>");
	else
		str.push("<a onclick='this.grid.changePage("+i+"); return false;'>"+i+"</a>");
	return str.join(sep);
}
dhtmlXGridObject.prototype._pgn_link=function(mode,ac,ds){
	if (mode=="prevpages" || mode=="prev"){
		if (this.currentPage==1) return ds;
		return '<a onclick=\'this.grid.changePageRelative(-1*'+(mode=="prev"?'1':'this.grid.pagesInGroup')+'); return false;\'>'+ac+'</a>'
	}
	
	if (mode=="nextpages" || mode=="next"){
		if (this.rowsBuffer.length/this.rowsBufferOutSize <= this.currentPage ) return ds;
		if (this.rowsBuffer.length/(this.rowsBufferOutSize*(mode=="next"?'1':this.pagesInGroup)) <= 1 ) return ds;
		return '<a onclick=\'this.grid.changePageRelative('+(mode=="next"?'1':'this.grid.pagesInGroup')+'); return false;\'>'+ac+'</a>'
	}
	
	if (mode=="current"){
		var i=this.currentPage+(ac?parseInt(ac):0);
		if (i<1 || Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize) < i ) return ds;
		return '<a '+(i==this.currentPage?"class='dhx_active_page_link' ":"")+'onclick=\'this.grid.changePage('+i+'); return false;\'>'+i+'</a>'
	}
	return ac;
}

dhtmlXGridObject.prototype._pgn_template_active=function(block){
	var tags=block.getElementsByTagName("A");
	if (tags)
	for (var i=0; i < tags.length; i++) {
		tags[i].grid=this;
	};
}
dhtmlXGridObject.prototype._pgn_template_compile=function(template){
	/*
	[prev],[next]
	[currentpages]
	[from],[to],[total]
	*/
	template=template.replace(/\[([^\]]*)\]/g,function(a,b){
			b=b.split(":");
			switch (b[0]){
			case "from": 
				return '"+(arguments[1]*1+(arguments[2]*1?1:0))+"';
			case "total":
				return '"+arguments[3]+"';
			case "to":
				return '"+arguments[2]+"';
			case "current":
			case "prev":
			case "next":
			case "prevpages":
			case "nextpages":
				return '"+this._pgn_link(\''+b[0]+'\',\''+b[1]+'\',\''+b[2]+'\')+"'
			case "currentpages":
				return '"+this._pgn_block(\''+b[1]+'\')+"'
			}
			//do it here
	})
	return new Function('return "'+template+'";')
}

dhtmlXGridObject.prototype.i18n.paging={
	results:"Results",
	records:"Records from ",
	to:" to ",
	page:"Page ",
	perpage:"rows per page",
	first:"To first Page",
	previous:"Previous Page",
	found:"Found records",
	next:"Next Page",
	last:"To last Page",
	of:" of ",
	notfound:"No Records Found"
}
/**
*  @desc: configure paging with toolbar mode ( must be called BEFORE enablePaging)
*  @param: navButtons - enable/disable navigation buttons
*  @param: navLabel - enable/disable navigation label
*  @param: pageSelect - enable/disable page selector
*  @param: perPageSelect - an array of "per page" select options ([5,10,15,20,25,30] by default)
*  @type: public
*  @edition: Professional
*/
dhtmlXGridObject.prototype.setPagingWTMode = function(navButtons,navLabel,pageSelect,perPageSelect){
	this._WTDef=[navButtons,navLabel,pageSelect,perPageSelect];
}
/**
*  @desc: Bricks skin for paging
*/
dhtmlXGridObject.prototype._pgn_bricks = function(page, start, end){
	//set class names depending on grid skin
	var tmp = (this.skin_name||"").split("_")[1];
	var sfx="";
	if(tmp=="light" || tmp=="modern" || tmp=="skyblue")
		sfx = "_"+tmp;
	
	this.pagerElAr = new Array();
	this.pagerElAr["pagerCont"] = document.createElement("DIV");
	this.pagerElAr["pagerBord"] = document.createElement("DIV");
	this.pagerElAr["pagerLine"] = document.createElement("DIV");
	this.pagerElAr["pagerBox"] = document.createElement("DIV");
	this.pagerElAr["pagerInfo"] = document.createElement("DIV");
	this.pagerElAr["pagerInfoBox"] = document.createElement("DIV");
	var se = (this.globalBox||this.objBox);
	this.pagerElAr["pagerCont"].style.width = se.clientWidth+"px";
	this.pagerElAr["pagerCont"].style.overflow = "hidden";
	this.pagerElAr["pagerCont"].style.clear = "both";
	this.pagerElAr["pagerBord"].className = "dhx_pbox"+sfx;
	this.pagerElAr["pagerLine"].className = "dhx_pline"+sfx;
	this.pagerElAr["pagerBox"].style.clear = "both";
	this.pagerElAr["pagerInfo"].className = "dhx_pager_info"+sfx;
	
	//create structure
	this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerBord"]);
	this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerLine"]);
	this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerInfo"]);
	this.pagerElAr["pagerLine"].appendChild(this.pagerElAr["pagerBox"]);
	this.pagerElAr["pagerInfo"].appendChild(this.pagerElAr["pagerInfoBox"]);
	this._pgn_parentObj.innerHTML = "";
	this._pgn_parentObj.appendChild(this.pagerElAr["pagerCont"]);
	
	
	
	
	if(this.rowsBuffer.length>0){
		var lineWidth = 20;
		var lineWidthInc = 22;
		
		//create left arrow if needed
		if(page>this.pagesInGroup){
			var pageCont = document.createElement("DIV");
			var pageBox = document.createElement("DIV");
			pageCont.className = "dhx_page"+sfx;
			pageBox.innerHTML = "&larr;";
			pageCont.appendChild(pageBox);
			this.pagerElAr["pagerBox"].appendChild(pageCont);
			var self = this;
			pageCont.pgnum = (Math.ceil(page/this.pagesInGroup)-1)*this.pagesInGroup;
			pageCont.onclick = function(){
				self.changePage(this.pgnum);
			}
			lineWidth +=lineWidthInc;
		}
		//create pages
		for(var i=1;i<=this.pagesInGroup;i++){
			var pageCont = document.createElement("DIV");
			var pageBox = document.createElement("DIV");
			pageCont.className = "dhx_page"+sfx;
			pageNumber = ((Math.ceil(page/this.pagesInGroup)-1)*this.pagesInGroup)+i;
			if(pageNumber>Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize))
				break;
			pageBox.innerHTML = pageNumber;
			pageCont.appendChild(pageBox);
			if(page==pageNumber){
				pageCont.className += " dhx_page_active"+sfx;
				pageBox.className = "dhx_page_active"+sfx;
			}else{
				var self = this;
				pageCont.pgnum = pageNumber;
				pageCont.onclick = function(){
					self.changePage(this.pgnum);
				}
			}
			lineWidth +=(parseInt(lineWidthInc/3)*pageNumber.toString().length)+15;
			pageBox.style.width = (parseInt(lineWidthInc/3)*pageNumber.toString().length)+8+"px";
			this.pagerElAr["pagerBox"].appendChild(pageCont);
		}
		//create right arrow if needed
		if(Math.ceil(page/this.pagesInGroup)*this.pagesInGroup<Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize)){
			var pageCont = document.createElement("DIV");
			var pageBox = document.createElement("DIV");
			pageCont.className = "dhx_page"+sfx;
			pageBox.innerHTML = "&rarr;";
			pageCont.appendChild(pageBox);
			this.pagerElAr["pagerBox"].appendChild(pageCont);
			var self = this;
			pageCont.pgnum = (Math.ceil(page/this.pagesInGroup)*this.pagesInGroup)+1;
			pageCont.onclick = function(){
				self.changePage(this.pgnum);
			}
			lineWidth +=lineWidthInc;
		}
		
		this.pagerElAr["pagerLine"].style.width = lineWidth+"px";
	}
	
	//create page info
	if(this.rowsBuffer.length>0 && this.showRecInfo)
		this.pagerElAr["pagerInfoBox"].innerHTML = this.i18n.paging.records+(start+1)+this.i18n.paging.to+end+this.i18n.paging.of+this.rowsBuffer.length;
	else if(this.rowsBuffer.length==0){
		this.pagerElAr["pagerLine"].parentNode.removeChild(this.pagerElAr["pagerLine"]);
		this.pagerElAr["pagerInfoBox"].innerHTML = this.i18n.paging.notfound;
	}
	//add whitespaces where necessary
	this.pagerElAr["pagerBox"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
	this.pagerElAr["pagerBord"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
	this.pagerElAr["pagerCont"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
	this.callEvent("onPaging",[]);			
}


/**
*  @desc: web toolbar skin for paging
*/
dhtmlXGridObject.prototype._pgn_toolbar = function(page, start, end){
	if (!this.aToolBar) this.aToolBar = this._pgn_createToolBar();
	var totalPages=Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize);
	
	if (this._WTDef[0]){
		this.aToolBar.enableItem("right");
		this.aToolBar.enableItem("rightabs");
		this.aToolBar.enableItem("left");
		this.aToolBar.enableItem("leftabs");
		if(this.currentPage>=totalPages){
			this.aToolBar.disableItem("right");
			this.aToolBar.disableItem("rightabs");
		}
		if(this.currentPage==1){
			this.aToolBar.disableItem("left");
			this.aToolBar.disableItem("leftabs");
		}
	}
	if (this._WTDef[2]){
		var that = this;
		this.aToolBar.forEachListOption("pages", function(id){
			that.aToolBar.removeListOption("pages", id);
		});
		var w = {dhx_skyblue: 4, dhx_web: 0, dhx_terrace: 14}[this.aToolBar.conf.skin];
		for (var i=0; i<totalPages; i++) {
			this.aToolBar.addListOption("pages", "pages_"+(i+1), NaN, "button", "<span style='padding: 0px "+w+"px 0px 0px;'>"+this.i18n.paging.page+(i+1)+"</span>", "paging_page.gif");
		}
		this.aToolBar.setItemText("pages", this.i18n.paging.page+page);
	}
	// pButton.setSelected(page.toString())
	
	
	if (this._WTDef[1]){
		if (!this.getRowsNum())
			this.aToolBar.setItemText('results',this.i18n.paging.notfound);
		else
			this.aToolBar.setItemText('results',"<div style='width:100%; text-align:center'>"+this.i18n.paging.records+(start+1)+this.i18n.paging.to+end+"</div>");
	}
	if (this._WTDef[3])
		this.aToolBar.setItemText("perpagenum", this.rowsBufferOutSize.toString()+" "+this.i18n.paging.perpage);
	
	this.callEvent("onPaging",[]);
}
dhtmlXGridObject.prototype._pgn_createToolBar = function(){
	this.aToolBar = new dhtmlXToolbarObject({
		parent: this._pgn_parentObj,
		skin: (this._pgn_skin_tlb||this.skin_name),
		icons_path: this.imgURL
	});
	if (!this._WTDef) this.setPagingWTMode(true, true, true, true);
	var self = this;
	this.aToolBar.attachEvent("onClick", function(val){
		val = val.split("_");
		switch (val[0]){
			case "leftabs":
				self.changePage(1);
				break;
			case "left":
				self.changePage(self.currentPage-1);
				break;
			case "rightabs":
				self.changePage(99999);
				break;
			case "right":
				self.changePage(self.currentPage+1);
				break;
			case "perpagenum":
				if (val[1]===this.undefined) return;
				self.rowsBufferOutSize = parseInt(val[1]);
				self.changePage();
				self.aToolBar.setItemText("perpagenum", val[1]+" "+self.i18n.paging.perpage);
				break;
			case "pages":
				if (val[1]===this.undefined) return;
				self.changePage(val[1]);
				self.aToolBar.setItemText("pages", self.i18n.paging.page+val[1]);
				break;
		}
	});
	// add buttons
	if (this._WTDef[0]) {
		this.aToolBar.addButton("leftabs", NaN, null, "ar_left_abs.gif", "ar_left_abs_dis.gif");
		this.aToolBar.addButton("left", NaN, null, "ar_left.gif", "ar_left_dis.gif");
	}
	if (this._WTDef[1]) {
		this.aToolBar.addText("results", NaN, this.i18n.paging.results);
		this.aToolBar.setWidth("results", "150");
		this.aToolBar.disableItem("results");
	}
	if (this._WTDef[0]) {
		this.aToolBar.addButton("right", NaN, null, "ar_right.gif", "ar_right_dis.gif");
		this.aToolBar.addButton("rightabs", NaN, null, "ar_right_abs.gif", "ar_right_abs_dis.gif");
	}
	if (this._WTDef[2]) {
		if (this.aToolBar.conf.skin == "dhx_terrace") this.aToolBar.addSeparator();
		this.aToolBar.addButtonSelect("pages", NaN, "select page", [], "paging_pages.gif", null, false, true);
	}
	var arr;
	if (arr = this._WTDef[3]) {
		if (this.aToolBar.conf.skin == "dhx_terrace") this.aToolBar.addSeparator();
		this.aToolBar.addButtonSelect("perpagenum", NaN, "select size", [], "paging_rows.gif", null, false, true);
		if (typeof arr != "object") arr = [5,10,15,20,25,30];
		var w = {dhx_skyblue: 4, dhx_web: 0, dhx_terrace: 18}[this.aToolBar.conf.skin];
		for (var k=0; k<arr.length; k++) {
			this.aToolBar.addListOption("perpagenum", "perpagenum_"+arr[k], NaN, "button", "<span style='padding: 0px "+w+"px 0px 0px;'>"+arr[k]+" "+this.i18n.paging.perpage+"</span>", "paging_page.gif");
		}
	}
	
	//var td = document.createElement("TD"); td.width = "5"; this.aToolBar.tr.appendChild(td);
	//var td = document.createElement("TD"); td.width = "100%"; this.aToolBar.tr.appendChild(td);
	
	return this.aToolBar;
}

/**
*   @desc: hide pivot table related to grid, if any exists, switch grid back to normal mode
*   @type: public
*   @topic: 0
*/ 

dhtmlXGridObject.prototype.hidePivot=function(cont){ 
	if (this._pgridCont){
		if (this._pgrid) this._pgrid.destructor();
		var c=this._pgridCont.parentNode;
		c.innerHTML="";
		if (c.parentNode==this.entBox) 
			this.entBox.removeChild(c);
		this._pgrid=this._pgridSelect=this._pUNI=this._pgridCont=null;
		
	}
}
/**
*   @desc: show pivot table based on grid
*   @type: public
*	@param: cont - html container in which pivot rendered, but default pivot will be rendered over existing grid
*	details: collection of settings; details.column_list - list of columns used in pivot selects; details.readonly - created pivot with fixed configuration, details.action, details.value, action.x, action.y - default values for 4 pivot's selects 
*   @topic: 0
*/ 
dhtmlXGridObject.prototype.makePivot=function(cont,details){
	details=details||{};
	this.hidePivot();
	
	if (!cont){
			var cont=document.createElement("DIV");
			cont.style.cssText="position:absolute; top:0px; left:0px;background-color:white;";
			cont.style.height=this.entBox.offsetHeight+"px";
			cont.style.width=this.entBox.offsetWidth+"px";
			if (this.entBox.style.position!="absolute")
				this.entBox.style.position="relative";
			this.entBox.appendChild(cont);
	}
	
	if (typeof(cont)!="object") cont=document.getElementById(cont)
   
    if (details.column_list)
    	this._column_list=details.column_list;
    else{
		this._column_list=[];
		for (var i=0; i<this.hdr.rows[1].cells.length; i++)
   			this._column_list.push(this.hdr.rows[1].cells[i][_isIE?"innerText":"textContent"])
   	}
   		
   	var that = this;
	cont.innerHTML="<table cellspacing='0' cellpadding='0'><tr><td style='width:160px' align='center'></td><td>&nbsp;&nbsp;&nbsp;</td><td></td></tr></table><div></div>";
	var z1=this.makePivotSelect(this._column_list);
		z1.style.width="80px";
		z1.onchange=function(){
			if (this.value!=-1)
				that._pivotS.value=this.value;
			else that._pivotS.value="";
			
			that._reFillPivotLists();
			that._renderPivot2();
		}		
	var z2=this.makePivotSelect(this._column_list);
		z2.onchange=function(){
			if (this.value!=-1)
				that._pivotS.x=this.value;
			else that._pivotS.x="";
			that._reFillPivotLists();
			that._renderPivot()
		}		
	var z3=this.makePivotSelect(this._column_list);
		z3.onchange=function(){
			if (this.value!=-1)
				that._pivotS.y=this.value;
			else that._pivotS.y="";
			that._reFillPivotLists();
			that._renderPivot()
		}
	var z4=this.makePivotSelect(["Sum","Min","Max","Average","Count"],-1);
		z4.style.width="70px";
		z4.onchange=function(){
			if (this.value!=-1)
				that._pivotS.action=this.value;
			else that._pivotS.action=null;
			
			that._renderPivot2();
		}
		
	if (details.readonly)
		z1.disabled=z2.disabled=z3.disabled=z4.disabled=true;
	
	cont.firstChild.rows[0].cells[0].appendChild(z4);
	cont.firstChild.rows[0].cells[0].appendChild(z1);
	cont.firstChild.rows[0].cells[2].appendChild(z2);
	
	var gr=cont.childNodes[1];
	gr.style.width=cont.offsetWidth+"px";
	gr.style.height=cont.offsetHeight-20+"px";
	gr.style.overflow="hidden";
	this._pgridCont=gr;
	this._pgridSelect=[z1,z2,z3,z4];
	
	this._pData=this._fetchPivotData();
	this._pUNI=[];
	this._pivotS={ action:(details.action||"0"), value:(typeof details.value != "undefined" ? (details.value||"0") : null), x:(typeof details.x != "undefined" ? (details.x||"0") : null), y:(typeof details.y != "undefined" ? (details.y||"0") : null) };
	
	z1.value=this._pivotS.value;
	z2.value=this._pivotS.x;
	z3.value=this._pivotS.y;
	z4.value=this._pivotS.action;
	
	that._reFillPivotLists();
	this._renderPivot();
}

dhtmlXGridObject.prototype._fetchPivotData=function(){ 
	var z=[];
	for (var i=0; i<this._cCount; i++) {
		var d=[];
		for (var j=0; j<this.rowsCol.length; j++) {
			if (this.rowsCol[j]._cntr) continue;
			d.push(this.cells2(j,i).getValue());	//TODO : excell caching 
		}
		z.push(d)
	}
	return z;
}

dhtmlXGridObject.prototype._renderPivot=function(){ 
	if (_isIE) this._pgridSelect[2].removeNode(true)
	if (this._pgrid)  
		this._pgrid.destructor();
	
	this._pgrid=new dhtmlXGridObject(this._pgridCont);
	this._pgrid.setImagePath(this.imgURL);
	this._pgrid.attachEvent("onBeforeSelect",function(){return false;});
	if (this._pivotS.x){
		var l=this._getUniList(this._pivotS.x);
		var s=[160];
		for (var i=0; i < l.length; i++) 
			s.push(100);
		l=[""].concat(l)
		this._pgrid.setHeader(l);
		this._pgrid.setInitWidths(s.join(","));
	} else {
		this._pgrid.setHeader("");
		this._pgrid.setInitWidths("160");
	}
		
	this._pgrid.init();
	this._pgrid.setEditable(false);
	this._pgrid.setSkin(this.entBox.className.replace("gridbox gridbox_",""));

	var t=this._pgrid.hdr.rows[1].cells[0];
	if (t.firstChild && t.firstChild.tagName=="DIV") t=t.firstChild;
	t.appendChild(this._pgridSelect[2]);
	this._pgrid.setSizes();
	
	if (this._pivotS.y){
		var l=this._getUniList(this._pivotS.y);
		for (var i=0; i < l.length; i++) {
			this._pgrid.addRow(this._pgrid.uid(),[l[i]],-1);
		};
	} else {
		this._pgrid.addRow(1,"not ready",1);
	}	
	this._renderPivot2();
}
dhtmlXGridObject.prototype._pivot_action_0=function(a,b,c,av,bv,data){ 
	var ret=0;
	var resA=data[a];
	var resB=data[b];
	var resC=data[c];
	for (var i = resA.length - 1; i >= 0; i--)
		if (resA[i]==av && resB[i]==bv) 
			ret+=this.parseFloat(resC[i]);
	return ret;
}
dhtmlXGridObject.prototype._pivot_action_1=function(a,b,c,av,bv,data){ 
	ret=9999999999;
	var resA=data[a];
	var resB=data[b];
	var resC=data[c];
	
	for (var i = resA.length - 1; i >= 0; i--)
		if (resA[i]==av && resB[i]==bv) 
			ret=Math.min(this.parseFloat(resC[i]),ret);
	if (ret==9999999999) ret="";
	return ret;
}
dhtmlXGridObject.prototype._pivot_action_2=function(a,b,c,av,bv,data){ 
	
	ret=-9999999999;
	var resA=data[a];
	var resB=data[b];
	var resC=data[c];
	for (var i = resA.length - 1; i >= 0; i--)
		if (resA[i]==av && resB[i]==bv) 
			ret=Math.max(this.parseFloat(resC[i]),ret);
	if (ret==-9999999999) ret="";
	return ret;
}
dhtmlXGridObject.prototype._pivot_action_3=function(a,b,c,av,bv,data){ 
	var ret=0;
	var count=0;
	var resA=data[a];
	var resB=data[b];
	var resC=data[c];
	for (var i = resA.length - 1; i >= 0; i--)
		if (resA[i]==av && resB[i]==bv) {
			ret+=this.parseFloat(resC[i]);
			count++;
		}
	return count?ret/count:"";
}
dhtmlXGridObject.prototype._pivot_action_4=function(a,b,c,av,bv,data){ 
	var ret=0;
	var count=0;
	var resA=data[a];
	var resB=data[b];
	var resC=data[c];
	for (var i = resA.length - 1; i >= 0; i--)
		if (resA[i]==av && resB[i]==bv) {
			ret++;
		}
	return ret;
}
dhtmlXGridObject.prototype.parseFloat = function(val){
	val = parseFloat(val);
	if (isNaN(val)) return 0;
	return val;
}
	
dhtmlXGridObject.prototype._renderPivot2=function(){ 
	if (!(this._pivotS.x && this._pivotS.y && this._pivotS.value && this._pivotS.action)) return;

	var action=this["_pivot_action_"+this._pivotS.action];
	var x=this._getUniList(this._pivotS.x);
	var y=this._getUniList(this._pivotS.y);
	
	for (var i=0; i < x.length; i++) {
		for (var j=0; j < y.length; j++) {
			this._pgrid.cells2(j,i+1).setValue(Math.round(action(this._pivotS.x,this._pivotS.y,this._pivotS.value,x[i],y[j],this._pData)*100)/100);
		};
		
	};
}


dhtmlXGridObject.prototype._getUniList=function(col){ 
    if (!this._pUNI[col]){
    	var t={};
    	var a=[];
    	for (var i = this._pData[col].length - 1; i >= 0; i--){
    		t[this._pData[col][i]]=true;
    	}
    	for (var n in t) 
      		if (t[n]===true) a.push(n);
      	this._pUNI[col]=a.sort();
   	}
   	
   	return this._pUNI[col];
}

dhtmlXGridObject.prototype._fillPivotList=function(z,list,miss,v){ 
	if (!miss){
		miss={};
		v=-1;
	}
	z.innerHTML="";
	z.options[z.options.length]=new Option("-select-",-1);
	for (var i=0; i<list.length; i++){
		if (miss[i] || list[i]===null) continue;
		z.options[z.options.length]=new Option(list[i],i);
	}	
	z.value=parseInt(v);
}

dhtmlXGridObject.prototype._reFillPivotLists=function(){ 
	var s=[]; 	var v=[];
	for (var i=0; i<3; i++){
		s.push(this._pgridSelect[i]);
		v.push(s[i].value);
	}
	
	
	var t=this._reFfillPivotLists;
	var m={}; m[v[1]]=m[v[2]]=true;
	this._fillPivotList(s[0],this._column_list,m,v[0]);
	m={}; m[v[0]]=m[v[2]]=true;
	this._fillPivotList(s[1],this._column_list,m,v[1]);
	m={}; m[v[1]]=m[v[0]]=true;
	this._fillPivotList(s[2],this._column_list,m,v[2]);
	
	this._reFfillPivotLists=t;
	
}


dhtmlXGridObject.prototype.makePivotSelect=function(list,miss){ 
	var z=document.createElement("SELECT");
	this._fillPivotList(z,list,miss);
	z.style.cssText="width:150px; height:20px; font-family:Tahoma; font-size:8pt; font-weight:normal;";
	
	
	return z;
}

dhtmlXGridObject.prototype.post = function(url, post, call, type){
	this.callEvent("onXLS", [this]);
	if (arguments.length == 2 && typeof call != "function"){
		type=call;
		call=null;
	}
	type=type||"xml";

	if (!this.xmlFileUrl)
		this.xmlFileUrl=url;
	this._data_type=type;

	this.xmlLoader = this.doLoadDetails;

	var that = this;
	this.xmlLoader = function(xml){
		if (!that.callEvent) return;
		that["_process_"+type](xml.xmlDoc);
		if (!that._contextCallTimer)
			that.callEvent("onXLE", [that,0,0,xml.xmlDoc,type]);

		if (call){
			call();
			call=null;
		}
	};
	dhx4.ajax.post(url, (post||""), this.xmlLoader);
}


/**
*   @desc: set rowspan with specified length starting from specified cell
*   @param: rowID - row Id
*	@param: colInd - column index
*	@param: length - length of rowspan
*	@edition: professional
*   @type:  public
*/
dhtmlXGridObject.prototype.setRowspan=function(rowID,colInd,length){
    var c=this[this._bfs_cells?"_bfs_cells":"cells"](rowID,colInd).cell;    
   var r=this.rowsAr[rowID];

   if (c.rowSpan && c.rowSpan!=1){
		var ur=r.nextSibling;   
		for (var i=1; i<c.rowSpan; i++){
			var tc=ur.childNodes[ur._childIndexes[c._cellIndex+1]]
			var ti=document.createElement("TD"); 
			ti.innerHTML="&nbsp;"; 
			ti._cellIndex=c._cellIndex;
			ti._clearCell=true;
			if (tc)
				tc.parentNode.insertBefore(ti,tc);
			else
				ur.parentNode.appendChild(ti);
			this._shiftIndexes(ur,c._cellIndex,-1);
	    	ur=ur.nextSibling;
	    }
    }

    c.rowSpan=length;
    if (!this._h2)
		r=r.nextSibling||this.rowsCol[this.rowsCol._dhx_find(r)+1];
	else
		r=this.rowsAr[ this._h2.get[r.idd].parent.childs[this._h2.get[r.idd].index+1].id ];
		
	var kids=[];
	for (var i=1; i<length; i++){
	    var ct=null;
		if (this._fake && !this._realfake)
		    ct=this._bfs_cells3(r,colInd).cell;
		else
		    ct=this.cells3(r,colInd).cell;
		
		

		this._shiftIndexes(r,c._cellIndex,1);
		if (ct)
    	ct.parentNode.removeChild(ct);
    	kids.push(r);
    	
    	if (!this._h2)
			r=r.nextSibling||this.rowsCol[this.rowsCol._dhx_find(r)+1];
		else { 
			var r=this._h2.get[r.idd].parent.childs[this._h2.get[r.idd].index+1];
			if (r) r=this.rowsAr[ r.id ];
		}
    }
    
    this.rowsAr[rowID]._rowSpan=this.rowsAr[rowID]._rowSpan||{};
    this.rowsAr[rowID]._rowSpan[colInd]=kids;
    if (this._fake && !this._realfake && colInd<this._fake._cCount) 
        this._fake.setRowspan(rowID,colInd,length)
}


dhtmlXGridObject.prototype._shiftIndexes=function(r,pos,ind){
		if (!r._childIndexes){
    	r._childIndexes=new Array();
        for (var z=0; z<r.childNodes.length; z++)
            r._childIndexes[z]=z;
		}
		
		for (var z=0; z<r._childIndexes.length; z++)
			if (z>pos)
            	r._childIndexes[z]=r._childIndexes[z]-ind;
				
}

/**
*   @desc: enable rowspan in grid
*   @type:  public
*	@edition: professional
*/
dhtmlXGridObject.prototype.enableRowspan=function(){
    this._erspan=true;
	this.enableRowspan=function(){};
	this.attachEvent("onAfterSorting",function(){
		if (this._dload) return; //can't be helped
		for (var i=1; i<this.obj.rows.length; i++)	
		  if (this.obj.rows[i]._rowSpan){
		  	var master=this.obj.rows[i];
		  	for (var kname in master._rowSpan){
			  	var row=master;
				var kids=row._rowSpan[kname];
			  	for (var j=0; j < kids.length; j++) {
			  		if(row.nextSibling)
			  			row.parentNode.insertBefore(kids[j],row.nextSibling);
			  		else 
			  			row.parentNode.appendChild(kids[j]);
			  		if (this._fake){ // split mode
			  		    var frow=this._fake.rowsAr[row.idd];
			  		    var fkid=this._fake.rowsAr[kids[j].idd];
			  		    if(frow.nextSibling)
			  		  	    frow.parentNode.insertBefore(fkid,frow.nextSibling);
			  		    else 
			  			  frow.parentNode.appendChild(fkid);
			  			 this._correctRowHeight(row.idd);
			  		}
			 		row=row.nextSibling;
			  	}
		    }
	  }
	  var t = this.rowsCol.stablesort;
	  this.rowsCol=new dhtmlxArray();
	  this.rowsCol.stablesort=t;
	  
	  for (var i=1; i<this.obj.rows.length; i++)	
	  	this.rowsCol.push(this.obj.rows[i]);
	  
	}) 
	
	this.attachEvent("onXLE",function(a,b,c,xml){
		for (var i=0; i<this.rowsBuffer.length; i++){
			var row = this.render_row(i);
			var childs = row.childNodes;
			for (var j=0; j<childs.length; j++){
				if (childs[j]._attrs["rowspan"]){
					this.setRowspan(row.idd, childs[j]._cellIndex, childs[j]._attrs["rowspan"]);
				}
			}
		}
	});
}

/**
*     @desc: enables block selection mode in grid
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.enableBlockSelection = function(mode)
{
	if (typeof this._bs_mode == "undefined"){
		var self = this;
		this.obj.onmousedown = function(e) {
			if (self._bs_mode) self._OnSelectionStart((e||event),this); return true;
		}
		this._CSVRowDelimiter = this.csv.row;
		this.attachEvent("onResize", function() {self._HideSelection(); return true;});
		this.attachEvent("onGridReconstructed", function() {self._HideSelection(); return true;});
		this.attachEvent("onFilterEnd",this._HideSelection);
	}
	if (mode===false){
		this._bs_mode=false;
		return this._HideSelection();
	} else this._bs_mode=true;

	if (!window.dhx4.isIPad){
		var area = this._clip_area = document.createElement("textarea");
		area.className = "dhx_tab_ignore";
		area.style.cssText = "position:absolute; width:1px; height:1px; overflow:hidden; color:transparent; background-color:transparent; bottom:1px; right:1px; border:none;";

		area.onkeydown=function(e){
	            e=e||event;
	            if (e.keyCode == 86 && (e.ctrlKey || e.metaKey))
					self.pasteBlockFromClipboard()
		};
	    document.body.insertBefore(this._clip_area,document.body.firstChild);

	    dhtmlxEvent(this.entBox,"click",function(){
	        if (!self.editor && self._clip_area)
	            self._clip_area.select();
	    });
	}
}
/**
*     @desc:  affect block selection, so it will copy|paste only visible text , not values behind
*	  @param: mode - true/false
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.forceLabelSelection = function(mode)
{
	this._strictText = dhx4.s2b(mode)
}


dhtmlXGridObject.prototype.selectBlock = function(sx, sy, ex, ey)
{
	sy = this.getRowIndex(sy);
	ey = this.getRowIndex(ey);

	this._CreateSelection(sy, sx);
    this._selectionArea = this._RedrawSelectionPos(this.cells2(sy, sx).cell, this.cells2(ey, ex).cell);
    this._ShowSelection();
}

dhtmlXGridObject.prototype._OnSelectionStart = function(event, obj)
{

	var self = this;
	if (event.button == 2) return;
	var src = event.srcElement || event.target;
	if (this.editor){
		if (src.tagName && (src.tagName=="INPUT" || src.tagName=="TEXTAREA"))   return;
		this.editStop();
	}
	
	self.setActive(true);
	var pos = this.getPosition(this.obj);
	var x = event.clientX - pos[0] + (document.body.scrollLeft||(document.documentElement?document.documentElement.scrollLeft:0));
	var y = event.clientY - pos[1] + (document.body.scrollTop||(document.documentElement?document.documentElement.scrollTop:0));
	this._CreateSelection(x-4, y-4);

	if (src == this._selectionObj) {
		this._HideSelection();
		this._startSelectionCell = null;
	} else {
	    while (src && (!src.tagName || src.tagName.toLowerCase() != 'td'))
	        src = src.parentNode;
	    this._startSelectionCell = src;
	}
	
	if (this._startSelectionCell){
		if (!this.callEvent("onBeforeBlockSelected",[this._startSelectionCell.parentNode.idd, this._startSelectionCell._cellIndex]))
			return this._startSelectionCell = null;
	}
	
	    //this._ShowSelection();
	    this.obj.onmousedown = null;
		this.obj[_isIE?"onmouseleave":"onmouseout"] = function(e){ if (self._blsTimer) window.clearTimeout(self._blsTimer); };	    
		this.obj.onmmold=this.obj.onmousemove;
		this._init_pos=[x,y];
	    this._selectionObj.onmousemove = this.obj.onmousemove = function(e) {e = e||event; if (e.preventDefault) e.preventDefault(); else e.returnValue = false;  self._OnSelectionMove(e);}
	    
	    
	    this._oldDMP=document.body.onmouseup;
	    document.body.onmouseup = function(e) {e = e||event; self._OnSelectionStop(e, this); return true; }
	this.callEvent("onBeforeBlockSelection",[]);
	document.body.onselectstart = function(){return false};//avoid text select	    
}

dhtmlXGridObject.prototype._getCellByPos = function(x,y){
	x=x;//+this.objBox.scrollLeft;
	if (this._fake)
		x+=this._fake.objBox.scrollWidth;
	y=y;//+this.objBox.scrollTop;
	var _x=0;
	for (var i=0; i < this.obj.rows.length; i++) {
		y-=this.obj.rows[i].offsetHeight;
		if (y<=0) {
			_x=this.obj.rows[i];
			break;
		}
	}
	if (!_x || !_x.idd) return null;
	for (var i=0; i < this._cCount; i++) {
		x-=this.getColWidth(i);
		if (x<=0) {
			while(true){
				if (_x._childIndexes && _x._childIndexes[i+1]==_x._childIndexes[i])
					_x=_x.previousSibling;
				else {
					return this.cells(_x.idd,i).cell;
				}
				
			}
		}
	}
	return null;
}

dhtmlXGridObject.prototype._OnSelectionMove = function(event)
{ 
	
	var self=this;
	this._ShowSelection();
	var pos = this.getPosition(this.obj);
	var X = event.clientX - pos[0] + (document.body.scrollLeft||(document.documentElement?document.documentElement.scrollLeft:0));
	var Y = event.clientY - pos[1] + (document.body.scrollTop||(document.documentElement?document.documentElement.scrollTop:0));

	if ((Math.abs(this._init_pos[0]-X)<5) && (Math.abs(this._init_pos[1]-Y)<5)) return this._HideSelection();
	
	var temp = this._endSelectionCell;
	if(this._startSelectionCell==null)
 		this._endSelectionCell  = this._startSelectionCell = this.getFirstParentOfType(event.srcElement || event.target,"TD");		
	else
		if (event.srcElement || event.target) {
			if ((event.srcElement || event.target).className == "dhtmlxGrid_selection")
				this._endSelectionCell=(this._getCellByPos(X,Y)||this._endSelectionCell);
			else {
				var t = this.getFirstParentOfType(event.srcElement || event.target,"TD");
				if (t.parentNode.idd) this._endSelectionCell = t;
			}
		}
		
	if (this._endSelectionCell){
		if (!this.callEvent("onBeforeBlockSelected",[this._endSelectionCell.parentNode.idd, this._endSelectionCell._cellIndex]))
			this._endSelectionCell = temp;
	}
	
		/*
	//window.status = pos[0]+'+'+pos[1];
	var prevX = this._selectionObj.startX;
	var prevY = this._selectionObj.startY;
	var diffX = X - prevX;
	var diffY = Y - prevY;
	
	if (diffX < 0) {
        this._selectionObj.style.left = this._selectionObj.startX + diffX + 1+"px";
        diffX = 0 - diffX;
	} else {
		this._selectionObj.style.left = this._selectionObj.startX - 3+"px";
	}
	if (diffY < 0) {
		this._selectionObj.style.top = this._selectionObj.startY + diffY + 1+"px";
        diffY = 0 - diffY;
	} else {
		this._selectionObj.style.top = this._selectionObj.startY - 3+"px";
	}
    this._selectionObj.style.width = (diffX>4?diffX-4:0) + 'px';
    this._selectionObj.style.height = (diffY>4?diffY-4:0) + 'px';


/* AUTO SCROLL */
	var BottomRightX = this.objBox.scrollLeft + this.objBox.clientWidth;
	var BottomRightY = this.objBox.scrollTop + this.objBox.clientHeight;
	var TopLeftX = this.objBox.scrollLeft;
	var TopLeftY = this.objBox.scrollTop;

	var nextCall=false;
	if (this._blsTimer) window.clearTimeout(this._blsTimer);	
	
	if (X+20 >= BottomRightX) {
		this.objBox.scrollLeft = this.objBox.scrollLeft+20;
		nextCall=true;
	} else if (X-20 < TopLeftX) {
		this.objBox.scrollLeft = this.objBox.scrollLeft-20;
		nextCall=true;
	}
	if (Y+20 >= BottomRightY && !this._realfake) {
		this.objBox.scrollTop = this.objBox.scrollTop+20;
		nextCall=true;
	} else if (Y-20 < TopLeftY && !this._realfake) {
		this.objBox.scrollTop = this.objBox.scrollTop-20;
		nextCall=true;		
	}
	this._selectionArea = this._RedrawSelectionPos(this._startSelectionCell, this._endSelectionCell);
	

	if (nextCall){ 
		var a=event.clientX;
		var b=event.clientY;
		this._blsTimer=window.setTimeout(function(){self._OnSelectionMove({clientX:a,clientY:b})},100);
	}
	
}

dhtmlXGridObject.prototype._OnSelectionStop = function(event)
{
	var self = this;
	if (this._blsTimer) window.clearTimeout(this._blsTimer);	
	this.obj.onmousedown = function(e) {if (self._bs_mode)  self._OnSelectionStart((e||event), this); return true;}
	this.obj.onmousemove = this.obj.onmmold||null;
	this._selectionObj.onmousemove = null;
	document.body.onmouseup = this._oldDMP||null;
	if ( parseInt( this._selectionObj.style.width ) < 2 && parseInt( this._selectionObj.style.height ) < 2) {
		this._HideSelection();
	} else {
	    var src = this.getFirstParentOfType(event.srcElement || event.target,"TD");
	    if ((!src) || (!src.parentNode.idd)){
	    	src=this._endSelectionCell;
    		}
	    while (src && (!src.tagName || src.tagName.toLowerCase() != 'td'))
	        src = src.parentNode;
	    if (!src) 
	    	return this._HideSelection();
	    this._stopSelectionCell = src;
	    this._selectionArea = this._RedrawSelectionPos(this._startSelectionCell, this._stopSelectionCell);
		this.callEvent("onBlockSelected",[]);
	}
	document.body.onselectstart = function(){};//avoid text select
}

dhtmlXGridObject.prototype._RedrawSelectionPos = function(LeftTop, RightBottom)
{

	if (LeftTop.parentNode.grid != RightBottom.parentNode.grid)
		return this._selectionArea;

//	td._cellIndex
//
//	getRowIndex
	var pos = {};
	pos.LeftTopCol = LeftTop._cellIndex;
	pos.LeftTopRow = this.getRowIndex( LeftTop.parentNode.idd );
	pos.RightBottomCol = RightBottom._cellIndex;
	pos.RightBottomRow = this.getRowIndex( RightBottom.parentNode.idd );

	var LeftTop_width = LeftTop.offsetWidth;
	var LeftTop_height = LeftTop.offsetHeight;
	LeftTop = this.getPosition(LeftTop, this.obj);

	var RightBottom_width = RightBottom.offsetWidth;
	var RightBottom_height = RightBottom.offsetHeight;
	RightBottom = this.getPosition(RightBottom, this.obj);

    if (LeftTop[0] < RightBottom[0]) {
		var Left = LeftTop[0];
		var Right = RightBottom[0] + RightBottom_width;
    } else {
    	var foo = pos.RightBottomCol;
        pos.RightBottomCol = pos.LeftTopCol;
        pos.LeftTopCol = foo;
		var Left = RightBottom[0];
		var Right = LeftTop[0] + LeftTop_width;
    }

    if (LeftTop[1] < RightBottom[1]) {
		var Top = LeftTop[1];
		var Bottom = RightBottom[1] + RightBottom_height;
    } else {
    	var foo = pos.RightBottomRow;
        pos.RightBottomRow = pos.LeftTopRow;
        pos.LeftTopRow = foo;
		var Top = RightBottom[1];
		var Bottom = LeftTop[1] + LeftTop_height;
    }

    var Width = Right - Left;
    var Height = Bottom - Top;

	this._selectionObj.style.left = Left + 'px';
	this._selectionObj.style.top = Top + 'px';
	this._selectionObj.style.width =  Width  + 'px';
	this._selectionObj.style.height = Height + 'px';
	return pos;
}

dhtmlXGridObject.prototype._CreateSelection = function(x, y)
{
	if (this._selectionObj == null) {
		var div = document.createElement('div');
		div.style.position = 'absolute';
        div.style.display = 'none';
        div.className = 'dhtmlxGrid_selection';
		this._selectionObj = div;
		this._selectionObj.onmousedown = function(e){
			e=e||event;
			if (e.button==2 || (_isMacOS&&e.ctrlKey))
				return this.parentNode.grid.callEvent("onBlockRightClick", ["BLOCK",e]);
		}
		this._selectionObj.oncontextmenu=function(e){(e||event).cancelBubble=true;return false;}
		this.objBox.appendChild(this._selectionObj);
	}
    //this._selectionObj.style.border = '1px solid #83abeb';
    this._selectionObj.style.width = '0px';
    this._selectionObj.style.height = '0px';
    //this._selectionObj.style.border = '0px';
	this._selectionObj.style.left = x + 'px';
	this._selectionObj.style.top  = y + 'px';
    this._selectionObj.startX = x;
    this._selectionObj.startY = y;
}

dhtmlXGridObject.prototype._ShowSelection = function()
{
	if (this._selectionObj)
	    this._selectionObj.style.display = '';
}

dhtmlXGridObject.prototype._HideSelection = function()
{
	
	if (this._selectionObj)
	    this._selectionObj.style.display = 'none';
    this._selectionArea = null;
    if (this._clip_area){
    	this._clip_area.value="";
    	this._clip_area.blur();
    }
}
/**
*     @desc: copy content of block selection into clipboard in csv format (delimiter as set for csv serialization)
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.copyBlockToClipboard = function()
{
	if (!this._clip_area) return;

	if ( this._selectionArea != null ) {
		var serialized = new Array();
	if (this._mathSerialization)
         this._agetm="getMathValue";
    else if (this._strictText)
    	this._agetm="getTitle";
    else this._agetm="getValue";

    this._serialize_visible = true;

		for (var i=this._selectionArea.LeftTopRow; i<=this._selectionArea.RightBottomRow; i++) {
			var data = this._serializeRowToCVS(this.rowsBuffer[i], null,  this._selectionArea.LeftTopCol, this._selectionArea.RightBottomCol+1);
			if (!this._csvAID)
				serialized[serialized.length] = data.substr( data.indexOf( this.csv.cell ) + 1 );	//remove row ID and add to array
			else
				serialized[serialized.length] = data;
		}
		serialized = serialized.join(this._CSVRowDelimiter);
		
		this._clip_area.value = serialized;
        this._clip_area.select();

	this._serialize_visible = false;
	}
}
/**
*     @desc: paste content of clipboard into block selection of grid
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.pasteBlockFromClipboard = function(){
	if (!this._clip_area) return;

	this._clip_area.select();
    var self = this;
    window.setTimeout(function(){
        self._pasteBlockFromClipboard();
        self=null;
    },1);
}
dhtmlXGridObject.prototype._pasteBlockFromClipboard = function()
{
	var serialized = this._clip_area.value;
	if (!serialized) return;

    if (this._selectionArea != null) {
        var startRow = this._selectionArea.LeftTopRow;
        var startCol = this._selectionArea.LeftTopCol;
    } else if (this.cell != null && !this.editor) {
        var startRow = this.getRowIndex( this.cell.parentNode.idd );
        var startCol = this.cell._cellIndex;
    } else {
        return false;
    }

	serialized = this.csvParser.unblock(serialized, this.csv.cell, this.csv.row);

    var endRow = startRow+serialized.length;
    var endCol = startCol+serialized[0].length;
    if (endCol > this._cCount)
		endCol = this._cCount;
    var k = 0;
    for (var i=startRow; i<endRow; i++) {
        var row = this.render_row(i);
        if (row==-1) continue;
        var l = 0;
        for (var j=startCol; j<endCol; j++) {
        	if (this._hrrar[j] && !this._fake){
        		endCol = Math.min(endCol+1, this._cCount);
        		continue;
        	}
        	var ed = this.cells3(row, j);
        	if (ed.isDisabled()) {
        	    l++;
        	    continue;
        	}
        	if (this._onEditUndoRedo)
        		this._onEditUndoRedo(2, row.idd, j, serialized[ k ][ l ], ed.getValue());
        	if (ed.combo){
				var comboVa = ed.combo.values;
				for(var n=0; n<comboVa.length; n++)
					if (serialized[ k ][ l ] == comboVa[n]){
						ed.setValue( ed.combo.keys[ n ]);
						comboVa=null;
						break;
					}
				if (comboVa!=null && ed.editable) ed.setValue( serialized[ k ][ l++ ] );
				else l++;
        	}else
        		ed[ ed.setImage ? "setLabel" : "setValue" ]( serialized[ k ][ l++ ] );
        	ed.cell.wasChanged=true;
        }
        this.callEvent("onRowPaste",[row.idd])
        k++;
    }
}

dhtmlXGridObject.prototype.getSelectedBlock = function() {
	// if block selection exists
	if (this._selectionArea)
		return this._selectionArea;
	else if (this.getSelectedRowId() !== null){
		// if one cell is selected
			return {
				LeftTopRow: this.getSelectedRowId(),
				LeftTopCol: this.getSelectedCellIndex(),
				RightBottomRow: this.getSelectedRowId(),
				RightBottomCol: this.getSelectedCellIndex()
			};
		} else
			return null;
};

/*
Limitation:
    a) Width of column in px
    b) Grid not autoresizable
    c) Initialize grid in visible state
*/

dhx4.attachEvent("onGridCreated", function(grid){
if (grid._split_later)
    grid.splitAt(grid._split_later);
});


/**
*   @desc:  split grid in two parts, with separate scrolling
*   @param:  ind - index of column to split after
*   @edition: Professional
*   @type:  public$
*/
dhtmlXGridObject.prototype.splitAt=function(ind){
if (!this.obj.rows[0]) return this._split_later=ind;
ind=parseInt(ind);

var leftBox=document.createElement("DIV");
this.entBox.appendChild(leftBox);
var rightBox=document.createElement("DIV");
this.entBox.appendChild(rightBox);

for (var i=this.entBox.childNodes.length-3; i>=0; i--)
	rightBox.insertBefore(this.entBox.childNodes[i],rightBox.firstChild);

this.entBox.style.position="relative";	
this.globalBox=this.entBox;
this.entBox=rightBox; rightBox.grid=this;

/*ORIGINAL
leftBox.style.cssText+="border:0px solid red !important;";
rightBox.style.cssText+="border:0px solid red !important;";
*/
/*HSITX*/
/*leftBox.style.cssText += "border-right:1px solid #d6d6d6 !important;";
*/

rightBox.style.top="0px";
rightBox.style.position="absolute";
    
leftBox.style.position="absolute";
leftBox.style.top="0px";
leftBox.style.left="0px";
leftBox.style.zIndex=11;
    
rightBox.style.height=leftBox.style.height=this.globalBox.clientHeight;


this._fake=new dhtmlXGridObject(leftBox);

this.globalBox=this._fake.globalBox=this.globalBox;
this._fake._fake=this;
this._fake._realfake=true;

//copy properties    
this._treeC=this.cellType._dhx_find("tree");
this._fake.delim=this.delim;
this._fake.customGroupFormat=this.customGroupFormat;

this._fake.setImagesPath(this._imgURL);
this._fake.iconURL = this.iconURL;
this._fake._customSorts=this._customSorts;
this._fake.noHeader=this.noHeader;
this._fake._enbTts=this._enbTts;
this._fake._drsclmW = this._drsclmW;
this._fake._htkebl = this._htkebl;
this._fake.clists = this.clists;
this._fake.fldSort=new Array();
this._fake.selMultiRows=this.selMultiRows;
this._fake.multiLine=this.multiLine;
this._fake._key_events = this._key_events;
this._fake.smartTabOrder = this.smartTabOrder;
this._fake._RaSeCol = this._RaSeCol;

if (this.multiLine || this._erspan){
	this.attachEvent("onCellChanged",this._correctRowHeight);
	this.attachEvent("onRowAdded",this._correctRowHeight);
	var corrector=function(){
		this.forEachRow(function(id){
			this._correctRowHeight(id);
		})
	};
	this.attachEvent("onPageChanged",corrector);
	this.attachEvent("onXLE",corrector);
	this.attachEvent("onResizeEnd",corrector);
	if (!this._ads_count) //in case of distribute parsing - use special event instead
		this.attachEvent("onAfterSorting",corrector);

    this.attachEvent("onFilterEnd", corrector);
	this.attachEvent("onDistributedEnd",corrector);
	
	//this._fake.attachEvent("onCellChanged",this._correctRowHeight);
	}
this.attachEvent("onGridReconstructed",function(){
	this._fake.objBox.scrollTop = this.objBox.scrollTop;
})

this._fake.loadedKidsHash=this.loadedKidsHash;
if (this._h2) this._fake._h2=this._h2;
this._fake._dInc=this._dInc;

//collect grid configuraton
var b_ha=[[],[],[],[],[],[],[]];
var b_ar=["hdrLabels","initCellWidth","cellType","cellAlign","cellVAlign","fldSort","columnColor"];
var b_fu=["setHeader","setInitWidths","setColTypes","setColAlign","setColVAlign","setColSorting","setColumnColor"];

this._fake.callEvent=function(){
	var result = true;
	this._fake._split_event=true;
	var hidden = (arguments[0] == "onScroll");
	if (arguments[0]=="onGridReconstructed" || hidden)
		this._fake.callEvent.apply(this,arguments);
	
	if (!hidden) result = this._fake.callEvent.apply(this._fake,arguments);
	this._fake._split_event=false;
	return result;
}
	
if (this._elmn)
	this._fake.enableLightMouseNavigation(true);

if (this._cssEven||this._cssUnEven)
    this._fake.attachEvent("onGridReconstructed",function(){
        this._fixAlterCss();
    });

this._fake._cssSP=this._cssSP;
this._fake.isEditable=this.isEditable;
this._fake._edtc=this._edtc;
if (this._sst) this._fake.enableStableSorting(true);

this._fake._sclE=this._sclE;
this._fake._dclE=this._dclE;
this._fake._f2kE=this._f2kE;
this._fake._maskArr=this._maskArr;
this._fake._dtmask=this._dtmask;
this._fake.combos=this.combos;

var width=0;

var m_w=this.globalBox.offsetWidth;
for (var i=0; i<ind; i++){
    for (var j=0; j<b_ar.length; j++){
        if (this[b_ar[j]])
            b_ha[j][i]=this[b_ar[j]][i];
        if (typeof b_ha[j][i] == "string") b_ha[j][i]=b_ha[j][i].replace(new RegExp("\\"+this.delim,"g"),"\\"+this.delim);
    }
    if (_isFF) b_ha[1][i]=b_ha[1][i]*1;
	if ( this.cellWidthType == "%"){
		b_ha[1][i]=Math.round(parseInt(this[b_ar[1]][i])*m_w/100);
		width+=b_ha[1][i];
	} else
        width+=parseInt(this[b_ar[1]][i]);
    	this.setColumnHidden(i,true);
    }


for (var j=0; j<b_ar.length; j++){
    var str=b_ha[j].join(this.delim);
   
if (b_fu[j]!="setHeader"){
	if (str!="")
		this._fake[b_fu[j]](str);
} else
    this._fake[b_fu[j]](str,null,this._hstyles,this._hcustomclass);
}


this._fake._strangeParams=this._strangeParams;
this._fake._drsclmn=this._drsclmn;

width = Math.min(this.globalBox.offsetWidth, width);
rightBox.style.left=width+"px";    leftBox.style.width=width+"px";
rightBox.style.width=Math.max(this.globalBox.offsetWidth-width,0);

if (this._ecspn) this._fake._ecspn=true;

//this._fake.setNoHeader(true);
this._fake.init();
if (this.dragAndDropOff)
	this.dragger.addDragLanding(this._fake.entBox, this);
	
this._fake.objBox.style.overflow="hidden";
if (!dhtmlx.$customScroll)
	this._fake.objBox.style.overflowX="scroll";
else    
	this._fake.objBox._custom_scroll_mode = "";

	this._fake._srdh=this._srdh||20;
	this._fake._srnd=this._srnd;
this._fake._cssEven=this._cssEven;
this._fake._cssUnEven=this._cssUnEven;
if (this.skin_name != this._fake.skin_name)
	this._fake.setSkin(this.skin_name);

	var selfmaster = this;
function _on_wheel(e){
	var cont = selfmaster.objBox;
	if (cont.scrollHeight - cont.offsetHeight > 2){
		var dir  = e.wheelDelta/-40;
		if (e.wheelDelta === window.undefined)
			dir = e.detail;
		cont.scrollTop += dir*40;
		
		if (e.preventDefault)
			e.preventDefault();
	}
}
dhtmlxEvent(this._fake.objBox,"mousewheel",_on_wheel);
dhtmlxEvent(this._fake.objBox,"DOMMouseScroll",_on_wheel);


//inner methods


	function change_td(a,b){ 
		b.style.whiteSpace="";
		var c=b.nextSibling;
		var cp=b.parentNode;
		a.parentNode.insertBefore(b,a);
		if (!c)
			cp.appendChild(a);
		else
			cp.insertBefore(a,c);
		var z=a.style.display;
		a.style.display=b.style.display;
		b.style.display=z;
			}
	function proc_hf(i,rows,mode,frows){
		var temp_header=(new Array(ind)).join(this.delim);
		var temp_rspan=[];
		if (i==2)
			for (var k=0; k<ind; k++){
				var r=rows[i-1].cells[rows[i-1]._childIndexes?rows[i-1]._childIndexes[k]:k];
				if (r.rowSpan && r.rowSpan>1){
					temp_rspan[r._cellIndex]=r.rowSpan-1;
					frows[i-1].cells[frows[i-1]._childIndexes?frows[i-1]._childIndexes[k]:k].rowSpan=r.rowSpan;
					r.rowSpan=1;
				}
			}
			
			for (i; i<rows.length; i++){
				this._fake.attachHeader(temp_header,null,mode);
				frows=frows||this._fake.ftr.childNodes[0].rows;
				var max_ind=ind;
				var r_cor=0;
				for (var j=0; j<max_ind; j++){
					
					if (temp_rspan[j]) { 
						temp_rspan[j]=temp_rspan[j]-1;
						if (_isIE || _isOpera) {
							var td=document.createElement("TD");
							if (_isFF) td.style.display="none";
							rows[i].insertBefore(td,rows[i].cells[0])
						}
						
						r_cor++;
						continue;
					}

					var a=frows[i].cells[j-r_cor];
					var b=rows[i].cells[j-(_isIE?0:r_cor)];
					var t=b.rowSpan;
					
					change_td(a,b);
					if (t>1){ 
						temp_rspan[j]=t-1;
						b.rowSpan=t;
					}
					if (frows[i].cells[j].colSpan>1){
						rows[i].cells[j].colSpan=frows[i].cells[j].colSpan;
						max_ind-=frows[i].cells[j].colSpan-1;
						for (var k=1; k < frows[i].cells[j].colSpan; k++) 
							frows[i].removeChild(frows[i].cells[j+1]);
			}
	}
}
	}
	
	if (this.hdr.rows.length>2)
		proc_hf.call(this,2,this.hdr.rows,"_aHead",this._fake.hdr.rows);
	if (this.ftr){
		proc_hf.call(this,1,this.ftr.childNodes[0].rows,"_aFoot");
		this._fake.ftr.parentNode.style.bottom=(_isFF?2:1)+"px";
	}
	

    if (this.saveSizeToCookie){
	   this.saveSizeToCookie=function(name,cookie_param){
	   		if (this._realfake)
				return this._fake.saveSizeToCookie.apply(this._fake,arguments);

			if (!name) name=this.entBox.id;
			var z=new Array();
			var n="cellWidthPX";
	
			for (var i=0; i<this[n].length; i++)
				if (i<ind)
					z[i]=this._fake[n][i];
				else
					z[i]=this[n][i];
			z=z.join(",")
			this.setCookie(name,cookie_param,0,z);
			var z=(this.initCellWidth||(new  Array)).join(",");
			this.setCookie(name,cookie_param,1,z);

		    return true;
		}
	this.loadSizeFromCookie=function(name){
		if (!name) name=this.entBox.id;
		var z=this._getCookie(name,1);

		if (!z) return
		this.initCellWidth=z.split(",");
		var z=this._getCookie(name,0);
		var n="cellWidthPX";
		this.cellWidthType="px";
		
        var summ2=0;
		if ((z)&&(z.length)){
			z=z.split(",");
			for (var i=0; i<z.length; i++)
				if (i<ind){
				   this._fake[n][i]=z[i];
				   summ2+=z[i]*1;
				   }
				else
				   this[n][i]=z[i];
		}

		this._fake.entBox.style.width=summ2+"px";
		this._fake.objBox.style.width=summ2+"px";
			var pa=this.globalBox.childNodes[1];
		    pa.style.left=summ2-(_isFF?0:0)+"px";
		if (this.ftr)
    		this.ftr.style.left=summ2-(_isFF?0:0)+"px";
			pa.style.width=this.globalBox.offsetWidth-summ2+"px";

		this.setSizes();
	    return true;
	}
	   	this._fake.onRSE=this.onRSE;
	}


		this.setCellTextStyleA=this.setCellTextStyle;
		this.setCellTextStyle=function(row_id,i,styleString){
			if  (i<ind) this._fake.setCellTextStyle(row_id,i,styleString);
			this.setCellTextStyleA(row_id,i,styleString);
		}
		this.setRowTextBoldA=this.setRowTextBold;
			this.setRowTextBold = function(row_id){
			this.setRowTextBoldA(row_id);
			this._fake.setRowTextBold(row_id);
        }
        
        this.setRowColorA=this.setRowColor;
			this.setRowColor = function(row_id,color){
			this.setRowColorA(row_id,color);
			this._fake.setRowColor(row_id,color);
        } 
                   
		this.setRowHiddenA=this.setRowHidden;
			this.setRowHidden = function(id,state){
			this.setRowHiddenA(id,state);
			this._fake.setRowHidden(id,state);
        }

		this.setRowTextNormalA=this.setRowTextNormal;
			this.setRowTextNormal = function(row_id){
			this.setRowTextNormalA(row_id);
			this._fake.setRowTextNormal(row_id);
        }


		this.getChangedRows = function(and_added){
			var res = new Array();
			function test(row){
					for (var j = 0; j < row.childNodes.length; j++) 
						if (row.childNodes[j].wasChanged)
							return res[res.length]=row.idd;
			}
			this.forEachRow(function(id){
				var row = this.rowsAr[id];
				var frow = this._fake.rowsAr[id];
				if (row.tagName!="TR" || !frow || frow.tagName!="TR") return;
				if (and_added && row._added)
					res[res.length]=row.idd;
				else{
					if (!test(row)) test(frow);
				}
			});
			return res.join(this.delim);
		};
		this.setRowTextStyleA=this.setRowTextStyle;
			this.setRowTextStyle = function(row_id,styleString){
			this.setRowTextStyleA(row_id,styleString);
			if (this._fake.rowsAr[row_id])
			this._fake.setRowTextStyle(row_id,styleString);
        }

		this.lockRowA = this.lockRow;
		this.lockRow = function(id,mode){ this.lockRowA(id,mode); this._fake.lockRow(id,mode); }
		
		this.getColWidth = function(i){
			if  (i<ind) return parseInt(this._fake.cellWidthPX[i]);
			else return parseInt(this.cellWidthPX[i]);
        };
        this.getColumnLabel = function(i){
        	return this._fake.getColumnLabel.apply(((i<ind)?this._fake:this) ,arguments);
        };
		this.setColWidthA=this._fake.setColWidthA=this.setColWidth;
		this.setColWidth = function(i,value){
			i=i*1;
			if  (i<ind) this._fake.setColWidthA(i,value);
			else this.setColWidthA(i,value);
			if ((i+1)<=ind) this._fake._correctSplit(Math.min(this._fake.objBox.offsetWidth,this._fake.obj.offsetWidth));
        }
		this.adjustColumnSizeA=this.adjustColumnSize;
		this.setColumnLabelA=this.setColumnLabel;
		this.setColumnLabel=function(a,b,c,d){
			var that  = this;
			if (a<ind) that = this._fake;
			return this.setColumnLabelA.apply(that,[a,b,c,d]);
		}
		this.adjustColumnSize=function(aind,c){
			if  (aind<ind) {
				if (_isIE) this._fake.obj.style.tableLayout="";
				this._fake.adjustColumnSize(aind,c);
				if (_isIE) this._fake.obj.style.tableLayout="fixed";
			    this._fake._correctSplit();
				}
			else return this.adjustColumnSizeA(aind,c);
		}

        var zname="cells";
        this._bfs_cells=this[zname];
        this[zname]=function(){
                if (arguments[1]<ind){
                    return this._fake.cells.apply(this._fake,arguments);
                } else
                    return this._bfs_cells.apply(this,arguments);
                }
        
        this._bfs_isColumnHidden=this.isColumnHidden;        
        this.isColumnHidden=function(){
			if (parseInt(arguments[0])<ind)
				return this._fake.isColumnHidden.apply(this._fake,arguments);
			else
				return this._bfs_isColumnHidden.apply(this,arguments);
        }                    


        this._bfs_setColumnHidden=this.setColumnHidden;        
        this.setColumnHidden=function(){
                if (parseInt(arguments[0])<ind){
                    this._fake.setColumnHidden.apply(this._fake,arguments);
                    return this._fake._correctSplit();
        		}
                else
                    return this._bfs_setColumnHidden.apply(this,arguments);
                }                    

        var zname="cells2";
        this._bfs_cells2=this[zname];
        this[zname]=function(){
                if (arguments[1]<ind)
                    return this._fake.cells2.apply(this._fake,arguments);
                else
                    return this._bfs_cells2.apply(this,arguments);
                }

        var zname="cells3";
        this._bfs_cells3=this[zname];
        this[zname]=function(a,b){
                if (arguments[1]<ind && this._fake.rowsAr[arguments[0].idd]){
                    //fall back for totally rowspanned row
                    if (this._fake.rowsAr[a.idd] && this._fake.rowsAr[a.idd].childNodes.length==0)  return this._bfs_cells3.apply(this,arguments);
                    arguments[0]=arguments[0].idd;
                    return this._fake.cells.apply(this._fake,arguments);
                    }
                else
                    return this._bfs_cells3.apply(this,arguments);
                }

        var zname="changeRowId";
        this._bfs_changeRowId=this[zname];
        this[zname]=function(){
            this._bfs_changeRowId.apply(this,arguments);
            if (this._fake.rowsAr[arguments[0]])
            	this._fake.changeRowId.apply(this._fake,arguments);
        }
        this._fake.getRowById=function(id){
        	var row = this.rowsAr[id];
        	if (!row && this._fake.rowsAr[id]) row=this._fake.getRowById(id);
			
		
			if (row){
				if (row.tagName != "TR"){
					for (var i = 0; i < this.rowsBuffer.length; i++)
						if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id)
							return this.render_row(i);
					if (this._h2) return this.render_row(null,row.idd);
				}
				return row;
			}
			return null;
		}

        if (this.collapseKids){
			//tree grid
            this._fake["_bfs_collapseKids"]=this.collapseKids;
			this._fake["collapseKids"]=function(){
				return this._fake["collapseKids"].apply(this._fake,[this._fake.rowsAr[arguments[0].idd]]);
			}
			
            this["_bfs_collapseKids"]=this.collapseKids;
			this["collapseKids"]=function(){
				var z=this["_bfs_collapseKids"].apply(this,arguments);
				this._fake._h2syncModel();
				if (!this._cssSP) this._fake._fixAlterCss();
			}				
			
			
            this._fake["_bfs_expandKids"]=this.expandKids;
			this._fake["expandKids"]=function(){
				this._fake["expandKids"].apply(this._fake,[this._fake.rowsAr[arguments[0].idd]]);
				if (!this._cssSP) this._fake._fixAlterCss();
			}
			

			this["_bfs_expandAll"]=this.expandAll;
			this["expandAll"]=function(){
				this._bfs_expandAll();
				this._fake._h2syncModel();
				if (!this._cssSP) this._fake._fixAlterCss();
			}

			this["_bfs_collapseAll"]=this.collapseAll;
			this["collapseAll"]=function(){
				this._bfs_collapseAll();
				this._fake._h2syncModel();
				if (!this._cssSP) this._fake._fixAlterCss();
			}								
			
            this["_bfs_expandKids"]=this.expandKids;
			this["expandKids"]=function(){
				var z=this["_bfs_expandKids"].apply(this,arguments);
				this._fake._h2syncModel();
				if (!this._cssSP) this._fake._fixAlterCss();
			}				
			
			this._fake._h2syncModel=function(){
				if (this._fake.pagingOn) this._fake._renderSort();
				else this._renderSort();
			}
			this._updateTGRState=function(a){
				return this._fake._updateTGRState(a);
			}
		}



			//split


  if (this._elmnh){
		this._setRowHoverA=this._fake._setRowHoverA=this._setRowHover;
		this._unsetRowHoverA=this._fake._unsetRowHoverA=this._unsetRowHover;
		this._setRowHover=this._fake._setRowHover=function(){
			var that=this.grid;
			that._setRowHoverA.apply(this,arguments);
			var z=(_isIE?event.srcElement:arguments[0].target);
			z=that._fake.rowsAr[that.getFirstParentOfType(z,'TD').parentNode.idd];
			if (z){
				that._fake._setRowHoverA.apply(that._fake.obj,[{target:z.childNodes[0]},arguments[1]]);
			   	}
		};
		this._unsetRowHover=this._fake._unsetRowHover=function(){
			if (arguments[1]) var that=this;
			else	var that=this.grid;
			that._unsetRowHoverA.apply(this,arguments);
			that._fake._unsetRowHoverA.apply(that._fake.obj,arguments);
		};
	  		this._fake.enableRowsHover(true,this._hvrCss);
	  		this.enableRowsHover(false);
	  		this.enableRowsHover(true,this._fake._hvrCss);
		}

		this._updateTGRState=function(z){ 
			if (!z.update || z.id==0) return;
			if (this.rowsAr[z.id].imgTag)
				this.rowsAr[z.id].imgTag.src=this.iconTree+z.state+".gif";
			if (this._fake.rowsAr[z.id] && this._fake.rowsAr[z.id].imgTag)
				this._fake.rowsAr[z.id].imgTag.src=this.iconTree+z.state+".gif";
			z.update=false;
		}
		this.copy_row=function(row){
			    var x=row.cloneNode(true);
                x._skipInsert=row._skipInsert;
                x._locked = row._locked;
                var r_ind=ind;
                x._attrs={};
                x._css = row._css;
                
                if (this._ecspn){
                	r_ind=0;
                	for (var i=0; (r_ind<x.childNodes.length && i<ind); i+=(x.childNodes[r_ind].colSpan||1))
                		r_ind++;
                }
                            
                while (x.childNodes.length>r_ind)
                    x.removeChild(x.childNodes[x.childNodes.length-1]);
                    var zm=r_ind;
                for (var i=0; i<zm; i++){
                	
					if (this.dragAndDropOff)
						this.dragger.addDraggableItem(x.childNodes[i], this);                        
                    x.childNodes[i].style.display=(this._fake._hrrar?(this._fake._hrrar[i]?"none":""):"");
                    x.childNodes[i]._cellIndex=i;
                    //TODO - more universal solution
                    x.childNodes[i].combo_value=arguments[0].childNodes[i].combo_value;
                    x.childNodes[i]._clearCell=arguments[0].childNodes[i]._clearCell;
                    x.childNodes[i]._cellType=arguments[0].childNodes[i]._cellType;
					x.childNodes[i]._brval=arguments[0].childNodes[i]._brval;
					x.childNodes[i].val =arguments[0].childNodes[i].val;
					x.childNodes[i]._combo =arguments[0].childNodes[i]._combo;
					x.childNodes[i]._attrs=arguments[0].childNodes[i]._attrs;
					x.childNodes[i].chstate=arguments[0].childNodes[i].chstate;
					
					
					/*HSITX*/
					if(!xui.valid.isEmpty(arguments[0].childNodes[i].config)){
						x.childNodes[i].config	= arguments[0].childNodes[i].config;
						if(!xui.valid.isEmpty(x.childNodes[i].config.controller)){
							x.childNodes[i].config.controller.element = x.childNodes[i].querySelector("input");
						}
					}
					/**/
					
					if (row._attrs['style']) x.childNodes[i].style.cssText = row._attrs['style']+";"+x.childNodes[i].style.cssText;
					

					if(x.childNodes[i].colSpan>1) 
						x._childIndexes = arguments[0]._childIndexes;
				}
                
                if (this._h2 && this._treeC < ind){
					var trow=this._h2.get[arguments[0].idd];
            		x.imgTag=x.childNodes[this._treeC].childNodes[0].childNodes[trow.level];
					x.valTag=x.childNodes[this._treeC].childNodes[0].childNodes[trow.level+2];
                    }

				
                    x.idd=row.idd;
                    x.grid=this._fake;
                    
            	return x;
                    	}
                	
        var zname="_insertRowAt";
        this._bfs_insertRowAt=this[zname];
        this[zname]=function(){ 
                    var r=this["_bfs_insertRowAt"].apply(this,arguments);
                    arguments[0]=this.copy_row(arguments[0]);

                    var r2=this._fake["_insertRowAt"].apply(this._fake,arguments);
                    if (r._fhd){
						r2.parentNode.removeChild(r2);
                        this._fake.rowsCol._dhx_removeAt(this._fake.rowsCol._dhx_find(r2));
						r._fhd=false;
					}

					return r;
        }
        /*
var quirks = (_isIE && document.compatMode=="BackCompat");
	
	var isVScroll = this.parentGrid?false:(this.objBox.scrollHeight > this.objBox.offsetHeight);
	var isHScroll = this.parentGrid?false:(this.objBox.scrollWidth > this.objBox.offsetWidth); 
	var scrfix = _isFF?20:18;
	
	var outerBorder=(this.entBox.offsetWidth-this.entBox.clientWidth)/2;
			
	var gridWidth=this.entBox.clientWidth;
	var gridHeight=this.entBox.clientHeight;
	*/
        this._bfs_setSizes=this.setSizes;
        this.setSizes=function(){
        		if (this._notresize) return;
            	this._bfs_setSizes(this,arguments);
            	
				this.sync_headers()
				if (this.sync_scroll() && this._ahgr) this.setSizes(); //if scrolls was removed - check once more to correct auto-height
				
				var height = this.dontSetSizes ? (this.entBox.offsetHeight+"px") : this.entBox.style.height;
				this._fake.entBox.style.height = height;

                this._fake.objBox.style.height=this.objBox.style.height;
                this._fake.hdrBox.style.height=this.hdrBox.style.height;
                
                this._fake.objBox.scrollTop=this.objBox.scrollTop;
                
                this._fake.setColumnSizes(this._fake.entBox.clientWidth);
                
                this.globalBox.style.width=parseInt(this.entBox.style.width)+parseInt(this._fake.entBox.style.width);
                if (!this.dontSetSizes)
                	this.globalBox.style.height = height;
                
        }
        
        this.sync_scroll=this._fake.sync_scroll=function(end){
        		var old=this.objBox.style.overflowX;
        	    if (this.obj.offsetWidth<=this.objBox.offsetWidth)
                {
                	if (!end) return this._fake.sync_scroll(true);
                    this.objBox.style.overflowX="hidden";
                    this._fake.objBox.style.overflowX="hidden";
                }
                else if (!dhtmlx.$customScroll){
                    this.objBox.style.overflowX="scroll";
                    this._fake.objBox.style.overflowX="scroll";
                }
                return old!=this.objBox.style.overflowX;
    	}
        this.sync_headers=this._fake.sync_headers=function(){
        	if (this.noHeader || (this._fake.hdr.scrollHeight==this.hdr.offsetHeight) || this.noHeaderResize) return;
        //	if (this.hdr.rows.length!=2){
        		/*
        		for (var i=1; i<this.hdr.rows.length; i++){
        			var td = ind;
        			while (!this.hdr.rows[i].childNodes[td]) td--;
        			var ha=Math.min(this.hdr.rows[i].childNodes[td].scrollHeight+2, this.hdr.rows[i].scrollHeight);
					var hb=this._fake.hdr.rows[i].scrollHeight;
					if (ha!=hb)
						this._fake.hdr.rows[i].style.height=this.hdr.rows[i].style.height=Math.max(ha,hb)+"px";
					if (window._KHTMLrv) {
						var lindex = 0;
						while (this._fake._hrrar[lindex]) lindex++;
						this._fake.hdr.rows[i].childNodes[lindex].style.height=this.hdr.rows[i].childNodes[td].style.height=Math.max(ha,hb)+"px";
					}
				}
				*/
				this._fake.sync_headers;
		//	} else this._fake.hdr.style.height=this.hdr.offsetHeight+"px";
    	}
    	this._fake._bfs_setSizes=this._fake.setSizes;
        this._fake.setSizes=function(){
        		if (this._fake._notresize) return;
        		this._fake.setSizes();
        }
        
        var zname="_doOnScroll";
        this._bfs__doOnScroll=this[zname];
        this[zname]=function(){
                this._bfs__doOnScroll.apply(this,arguments);
                this._fake.objBox.scrollTop=this.objBox.scrollTop;
                this._fake["_doOnScroll"].apply(this._fake,arguments);
        }
        
        var zname="selectAll";
        this._bfs__selectAll=this[zname];
        this[zname]=function(){
                this._bfs__selectAll.apply(this,arguments);
                this._bfs__selectAll.apply(this._fake,arguments);
        }
        
        



        var zname="doClick";
        this._bfs_doClick=this[zname];
        this[zname]=function(){
                this["_bfs_doClick"].apply(this,arguments);
                    if (arguments[0].tagName=="TD"){
                        var fl=(arguments[0]._cellIndex>=ind);
						if (!arguments[0].parentNode.idd) return;
						if (!fl)
                        	arguments[0].className=arguments[0].className.replace(/cellselected/g,"");
                        //item selected but it left part not rendered yet
						if (!this._fake.rowsAr[arguments[0].parentNode.idd])
							this._fake.render_row(this.getRowIndex(arguments[0].parentNode.idd));
                        arguments[0]=this._fake.cells(arguments[0].parentNode.idd,(fl?0:arguments[0]._cellIndex)).cell;
                        if (fl) this._fake.cell=null;
                        this._fake["_bfs_doClick"].apply(this._fake,arguments);
                        if (fl) this._fake.cell=this.cell;
                        else this.cell=this._fake.cell;
                        if (this._fake.onRowSelectTime) clearTimeout(this._fake.onRowSelectTime)
                        if (fl) {
                            arguments[0].className=arguments[0].className.replace(/cellselected/g,"");
                            globalActiveDHTMLGridObject=this;
                            this._fake.cell=this.cell;                                
                            }
                        else{
                            this.objBox.scrollTop=this._fake.objBox.scrollTop;
                            }
                    }
        }
        this._fake._bfs_doClick=this._fake[zname];
        this._fake[zname]=function(){
                this["_bfs_doClick"].apply(this,arguments);
                    if (arguments[0].tagName=="TD"){
                        var fl=(arguments[0]._cellIndex<ind);
						if (!arguments[0].parentNode.idd) return;
                        arguments[0]=this._fake._bfs_cells(arguments[0].parentNode.idd,(fl?ind:arguments[0]._cellIndex)).cell;
                        this._fake.cell=null;
this._fake["_bfs_doClick"].apply(this._fake,arguments);
						this._fake.cell=this.cell;
                        if (this._fake.onRowSelectTime) clearTimeout(this._fake.onRowSelectTime)
                        if (fl) {
                            arguments[0].className=arguments[0].className.replace(/cellselected/g,"");
                            globalActiveDHTMLGridObject=this;
							this._fake.cell=this.cell;                                
							this._fake.objBox.scrollTop=this.objBox.scrollTop;
                            }
                    }
        }


this.clearSelectionA = this.clearSelection;
this.clearSelection = function(mode){
if (mode) this._fake.clearSelection();
this.clearSelectionA();
}


this.moveRowUpA = this.moveRowUp;
this.moveRowUp = function(row_id){
if (!this._h2)
	this._fake.moveRowUp(row_id);
this.moveRowUpA(row_id);
if (this._h2) this._fake._h2syncModel();
}
this.moveRowDownA = this.moveRowDown;
this.moveRowDown = function(row_id){
if (!this._h2)
	this._fake.moveRowDown(row_id);
this.moveRowDownA(row_id);
if (this._h2) this._fake._h2syncModel();
}



this._fake.getUserData=function(){	return this._fake.getUserData.apply(this._fake,arguments); }
this._fake.setUserData=function(){	return this._fake.setUserData.apply(this._fake,arguments); }

this.getSortingStateA=this.getSortingState;
this.getSortingState = function(){
var z=this.getSortingStateA();
if (z.length!=0) return z;
return this._fake.getSortingState();
}

this.setSortImgStateA=this._fake.setSortImgStateA=this.setSortImgState;
this.setSortImgState = function(a,b,c,d){
this.setSortImgStateA(a,b,c,d);
if (b*1<ind) {
	this._fake.setSortImgStateA(a,b,c,d);
	this.setSortImgStateA(false);
} else 
	this._fake.setSortImgStateA(false);
}


this._fake.doColResizeA = this._fake.doColResize;
this._fake.doColResize = function(ev,el,startW,x,tabW){ 
var a=-1;
var z=0;
if (arguments[1]._cellIndex==(ind-1)){
        a = this._initalSplR + (ev.clientX-x);
        if (!this._initalSplF) this._initalSplF=arguments[3]+this.objBox.scrollWidth-this.objBox.offsetWidth;
        if (this.objBox.scrollWidth==this.objBox.offsetWidth && (this._fake.alter_split_resize || (ev.clientX-x)>0 )){
        	arguments[3]=(this._initalSplF||arguments[3]);
        	z=this.doColResizeA.apply(this,arguments);
        } 
        else
        	z=this.doColResizeA.apply(this,arguments);
}
else{
    if (this.obj.offsetWidth<this.entBox.offsetWidth)
		a=this.obj.offsetWidth;
	z=this.doColResizeA.apply(this,arguments);
}

if (z !== false){
	this._correctSplit(a);
	this.resized=this._fake.resized=1;
}
return z;
}

	this._fake.changeCursorState = function(ev){
		var el = ev.target||ev.srcElement;
		if(el.tagName!="TD")
			el = this.getFirstParentOfType(el,"TD")
			if ((el.tagName=="TD")&&(this._drsclmn)&&(!this._drsclmn[el._cellIndex])) return;
		var check = (ev.layerX||0)+(((!_isIE)&&(ev.target.tagName=="DIV"))?el.offsetLeft:0);
		var pos = parseInt(this.getPosition(el,this.hdrBox)); 
		if(((el.offsetWidth - (ev.offsetX||(pos-check)*-1))<(_isOpera?20:10))||((this.entBox.offsetWidth - (ev.offsetX?(ev.offsetX+el.offsetLeft):check) + this.objBox.scrollLeft - 0)<(_isOpera?20:10))){
			el.style.cursor = "E-resize";
		}else
			el.style.cursor = "default";
		if (_isOpera) this.hdrBox.scrollLeft = this.objBox.scrollLeft;
	}
		
	this._fake.startColResizeA = this._fake.startColResize;
	this._fake.startColResize = function(ev){
        var z=this.startColResizeA(ev);
        this._initalSplR=this.entBox.offsetWidth;
        this._initalSplF=null;
        if (this.entBox.onmousemove){
            var m=this.entBox.parentNode;   
            if (m._aggrid) return z;
			m._aggrid=m.grid;   m.grid=this;
            this.entBox.parentNode.onmousemove=this.entBox.onmousemove;
            this.entBox.onmousemove=null;
        }
        return z;
	}
	this._fake.stopColResizeA = this._fake.stopColResize;
	this._fake.stopColResize = function(ev){
        if (this.entBox.parentNode.onmousemove){
            var m=this.entBox.parentNode;   m.grid=m._aggrid;   m._aggrid=null;
            this.entBox.onmousemove=this.entBox.parentNode.onmousemove;
            this.entBox.parentNode.onmousemove=null;
            if (this.obj.offsetWidth<this.entBox.offsetWidth)
            	this._correctSplit(this.obj.offsetWidth);
            }
        return this.stopColResizeA(ev);
	}



this.doKeyA = this.doKey;
this._fake.doKeyA = this._fake.doKey;

function inner_runner(index, rindex, master, ev){
var dir = ev.shiftKey ? -1 : 1;
var end = ev.shiftKey ? -1 : master._cCount;
var next = false;

for (var i=index+dir; i!=end; i+=dir){
	if (master.smartTabOrder){
		next = master.cells2(rindex, i).isDisabled() ? false : i;
	} else 
		next = i;

	if (next !== false){
		var editmode = !master._key_events.k_other;
		master.selectCell( rindex, next, false, false, editmode, true);
		ev.cancelBubble = true;
		if (ev.preventDefault) ev.preventDefault();
		return true;
	}
}
}

this._fake.doKey=this.doKey=function(ev){
                        if (!ev) return true;
                        if (this._htkebl) return true;
	if ((ev.target||ev.srcElement).value !== window.undefined){
		var zx = (ev.target||ev.srcElement);

		if ((!zx.parentNode)||(zx.parentNode.className.indexOf("editable") == -1))
			return true;
	}
	                            
switch (ev.keyCode){
    case 9:
    	var master = this._realfake ? this._fake : this;
    	if (!master.callEvent("onTab",[true])) return true;

                if (this.cell){
    		var index = this.cell._cellIndex;
						
			var rindex = master.getRowIndex(this.cell.parentNode.idd);
			while (!inner_runner(index, rindex, master, ev)){
				rindex += (ev.shiftKey ? -1 : 1);
				if (rindex < 0 || rindex >= master.rowsBuffer.length) return;
				index = ev.shiftKey ? master._cCount : -1;					
            }
			return;
        }
   break;
}
return  this.doKeyA(ev);
}


this.editCellA=this.editCell;
this.editCell=function(){
if (this.cell && this.cell.parentNode.grid != this) return this._fake.editCell();
return this.editCellA();
}

this.deleteRowA = this.deleteRow;
this.deleteRow=function(row_id,node){
/*	if (!this._realfake)
	this._fake.loadedKidsHash=this.loadedKidsHash;*/

if (this.deleteRowA(row_id,node)===false) return false;
if (this._fake.rowsAr[row_id])
	this._fake.deleteRow(row_id);
}

this.clearAllA = this.clearAll;
this.clearAll=function(){
this.clearAllA();
this._fake.clearAll();
}
this.editStopA = this.editStop;
this.editStop=function(mode){
if (this._fake.editor)
	this._fake.editStop(mode);
else 
	this.editStopA(mode);
};


this.attachEvent("onAfterSorting",function(i,b,c){
if (i>=ind) 
	this._fake.setSortImgState(false)
});



this._fake.sortField = function(a,b,c){ 
this._fake.sortField.call(this._fake,a,b,this._fake.hdr.rows[0].cells[a]);
if (this.fldSort[a]!="na" && this._fake.fldSorted){
	var mem = this._fake.getSortingState()[1];
	this._fake.setSortImgState(false);
	this.setSortImgState(true,arguments[0],mem)
}
}

this.sortTreeRowsA = this.sortTreeRows;
this._fake.sortTreeRowsA = this._fake.sortTreeRows;
this.sortTreeRows=this._fake.sortTreeRows=function(col,type,order,ar){
if (this._realfake) return this._fake.sortTreeRows(col,type,order,ar)

this.sortTreeRowsA(col,type,order,ar);
this._fake._h2syncModel();

            this._fake.setSortImgStateA(false);
this._fake.fldSorted=null;
}

/* SRND mode */
this._fake._fillers=[];
this._fake.rowsBuffer=this.rowsBuffer;
this.attachEvent("onClearAll",function(){
this._fake.rowsBuffer=this.rowsBuffer;	
})
this._add_filler_s=this._add_filler;
this._add_filler=function(a,b,c,e){
if (!this._fake._fillers) this._fake._fillers=[];
if (this._realfake || !e){
	var d;
	if (c && c.idd) d=this._fake.rowsAr[c.idd];
	else if (c && c.nextSibling) {
		d = {};
		d.nextSibling=this._fake.rowsAr[c.nextSibling.idd];
		d.parentNode=d.nextSibling.parentNode;
	} else if (this._fake._fillers.length){
		d = this._fake._fillers[this._fake._fillers.length-1][2];
	}
	this._fake._fillers.push(this._fake._add_filler(a,b,d));	
}

return this._add_filler_s.apply(this,arguments);
}
this._add_from_buffer_s=this._add_from_buffer;
this._add_from_buffer=function() { 
var res=this._add_from_buffer_s.apply(this,arguments);
if (res!=-1){
	this._fake._add_from_buffer.apply(this._fake,arguments);
	if (this.multiLine) this._correctRowHeight(this.rowsBuffer[arguments[0]].idd);
}
return res;
}
this._fake.render_row=function(ind){
var row=this._fake.render_row(ind);

if (row == -1) return -1;
if (row) {
	return this.rowsAr[row.idd]=this.rowsAr[row.idd]||this._fake.copy_row(row);
}
return null;
    }
this._reset_view_s=this._reset_view;
this._reset_view=function(){
this._fake._reset_view(true);
this._fake._fillers=[];
this._reset_view_s();
}

this.moveColumn_s=this.moveColumn;
this.moveColumn=function(a,b){
if (b>=ind) return this.moveColumn_s(a,b);
}


this.attachEvent("onCellChanged",function(id,i,val){
if (this._split_event && i<ind && this.rowsAr[id]){
	
	var cell=this._fake.rowsAr[id];
	if (!cell) return;
	if (cell._childIndexes)
		cell=cell.childNodes[cell._childIndexes[i]];
	else
		cell=cell.childNodes[i];
	var tcell = this.rowsAr[id].childNodes[i];

	if (tcell._treeCell && tcell.firstChild.lastChild)
		tcell.firstChild.lastChild.innerHTML = val;
	else
		tcell.innerHTML=cell.innerHTML;
	tcell._clearCell=false;
	tcell.combo_value = val;
	tcell.chstate=cell.chstate;	//TODO - more universal solution
}
})





this._fake.combos=this.combos;
this.setSizes();
if (this.rowsBuffer[0]) this._reset_view();
this.attachEvent("onXLE",function(){this._fake._correctSplit()})
this._fake._correctSplit();
}

dhtmlXGridObject.prototype._correctSplit=function(a){
/*ORIGINAL	
a=a||(this.obj.scrollWidth-this.objBox.scrollLeft);
a=Math.min(this.globalBox.offsetWidth, a);
if (a>-1){
    this.entBox.style.width=a+"px";
    this.objBox.style.width=a+"px";
	var outerBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth)/2;
    this._fake.entBox.style.left=a+"px";
    this._fake.entBox.style.width=Math.max(0,this.globalBox.offsetWidth-a-(this.quirks?0:2)*outerBorder)+"px";
    if (this._fake.ftr)
    	this._fake.ftr.parentNode.style.width=this._fake.entBox.style.width;
    if (_isIE){
	    var quirks=_isIE && !window.xmlHttpRequest;
		var outerBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth);
		this._fake.hdrBox.style.width=this._fake.objBox.style.width=Math.max(0,this.globalBox.offsetWidth-(quirks?outerBorder:0)-a)+"px";
	}
}
*/
	/*HSITX*/
	var a			= 0;
	var freezeWidth = 0;
	var gridWidth	= this.globalBox.offsetWidth;
	var outerBorder	= (this.globalBox.offsetWidth-this.globalBox.clientWidth)/2;
	if(!xui.valid.isEmpty(this.element)){
		var gridConfig	= this.element.gridController.config;
		var colModel	= gridConfig.colModel;
		for(var i = 0; i <= gridConfig.freezeColumnIdx; i++){
			if(i < gridConfig.plusIdx){
				if(gridConfig.ratio){
					freezeWidth += (gridWidth*3/100);
				}else{
					freezeWidth += 40;
				}
			}else{
				if(gridConfig.ratio){
					freezeWidth	+= (gridWidth*parseInt(colModel[i - gridConfig.plusIdx].width)/100);
				}else{
					freezeWidth	+= colModel[i - gridConfig.plusIdx].width;
				}
			}
		}
	}
	
	a = freezeWidth > 0 ? Math.round(freezeWidth) + outerBorder : 0;
	if (a>-1){
	    this.entBox.style.width=a+"px";
	    this.objBox.style.width=a+"px";
		var outerBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth)/2;
	    this._fake.entBox.style.left=a+"px";
	    this._fake.entBox.style.setProperty("width", "calc(100% - " + a + "px)", "important");
	    if (this._fake.ftr)
	    	this._fake.ftr.parentNode.style.width=this._fake.entBox.style.width;
	    if (_isIE){
		    var quirks=_isIE && !window.xmlHttpRequest;
			var outerBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth);
			this._fake.hdrBox.style.width=this._fake.objBox.style.width=Math.max(0,this.globalBox.offsetWidth-(quirks?outerBorder:0)-a)+"px";
		}
	}
	/**/
}

dhtmlXGridObject.prototype._correctRowHeight=function(id,ind){
if (!this.rowsAr[id] || !this._fake.rowsAr[id]) return;

var h=parseInt(this.rowsAr[id].style.height) || this.rowsAr[id].offsetHeight;
var h2=parseInt(this._fake.rowsAr[id].style.height) || this._fake.rowsAr[id].offsetHeight;
var max = Math.max(h,h2) - (this.rowsAr[id].delta_fix || 0);
if (!max) return;
this.rowsAr[id].style.height=this._fake.rowsAr[id].style.height=Math.round(max+1)+"px";
this.rowsAr[id].delta_fix = 1;
if (window._KHTMLrv) {
	var j = this._fake._cCount;
	var td;
	while (!td && j>=0){
		td = this.rowsAr[id].childNodes[j];
		j-=1;
	}
	var td2 = this._fake.rowsAr[id].firstChild;
	if (td && td2){
		td.style.height=td2.style.height=max+"px";
	}
}
}

/**
*   @desc: enable smart rendering mode
*   @type: public
*   @param: mode - true|false - enable|disable mode
*   @param: buffer - has sense only in dynamic loading mode, count of rows requrested from server by single operation, optional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableSmartRendering=function(mode,buffer,reserved){
	if (arguments.length>2){
		if (buffer && !this.rowsBuffer[buffer-1]) this.rowsBuffer[buffer-1]=0;
		buffer=reserved;
	}
	this._srnd=dhx4.s2b(mode);
	this._srdh=this._srdh||20;
	this._dpref=buffer||0;
	
};
/**
*   @desc: allows to pre-render rows during scrolling, make scrolling more smooth, but with small drop in overall perfomance
*   @type: public
*   @param: buffer - count of rows, which will be prerendered
*   @topic: 0
*/
dhtmlXGridObject.prototype.enablePreRendering=function(buffer){
	this._srnd_pr=parseInt(buffer||50);
};
/**
*   @desc: force grid in dyn. srnd mode fully load itself from server side
*   @type: public
*   @param: buffer - how much rows grid can request from server side in one operation
*   @topic: 0
*/
dhtmlXGridObject.prototype.forceFullLoading=function(buffer, callback){
	for (var i=0; i<this.rowsBuffer.length; i++)
		if (!this.rowsBuffer[i]){
			var usedbuffer = buffer || (this.rowsBuffer.length-i);
			if (this.callEvent("onDynXLS",[i,usedbuffer])){
				var self=this;
				this.load(this.xmlFileUrl+dhtmlx.url(this.xmlFileUrl)+"posStart="+i+"&count="+usedbuffer, function(){
					window.setTimeout(function(){	self.forceFullLoading(buffer, callback); },100); 
				}, this._data_type);
			}
			return;
		}
	if (callback) callback.call(this);
};

/**
*   @desc: set height which will be used in smart rendering mode for row calculation, function need to be used if you use custom skin for grid which changes default row height
*   @type: public
   @param: {int} height - awaited height of row
*   @returns: void
*   @topic: 0
*/      
dhtmlXGridObject.prototype.setAwaitedRowHeight = function(height) {
   this._srdh=parseInt(height);
};

dhtmlXGridObject.prototype._get_view_size=function(){
	return Math.floor(parseInt(this.entBox.offsetHeight)/this._srdh)+2;
};
dhtmlXGridObject.prototype._add_filler=function(pos,len,fil,rsflag){
	if (!len) return null;
	var id="__filler__";
	var row=this._prepareRow(id);
	row.firstChild.style.width="1px";
	row.firstChild.style.borderWidth = row.firstChild.style.padding = row.firstChild.style.margin ="0px";

	for (var i=1; i<row.childNodes.length; i++)
	    row.childNodes[i].style.display='none';
 	row.firstChild.style.height=len*this._srdh+"px";
 	fil=fil||this.rowsCol[pos];
 	if (fil && fil.nextSibling) 
 		fil.parentNode.insertBefore(row,fil.nextSibling);
 	else
 		if (_isKHTML)
 			this.obj.appendChild(row);
 		else
 			this.obj.rows[0].parentNode.appendChild(row);
 			
 	this.callEvent("onAddFiller",[pos,len,row,fil,rsflag]);
 	return [pos,len,row];
};
dhtmlXGridObject.prototype._update_srnd_view=function(){
	
	/*ORIGINAL
    var min=Math.floor(this.objBox.scrollTop/this._srdh);
    var max=min+this._get_view_size();
    if (this.multiLine) {
    // Calculate the min, by Stephane Bernard
        var pxHeight = this.objBox.scrollTop;
        min = 0;
        while(pxHeight > 0) {
            pxHeight-=this.rowsCol[min]?this.rowsCol[min].offsetHeight:this._srdh;
            min++;
        }
        // Calculate the max
        max=min+this._get_view_size();
        if (min>0) min--;
    }        
    max+=(this._srnd_pr||0);//pre-rendering
    if (max>this.rowsBuffer.length) max=this.rowsBuffer.length;

    for (var j=min; j<max; j++){ 
        if (!this.rowsCol[j]){
			var res=this._add_from_buffer(j);
			if (res==-1){
				if (this.xmlFileUrl){
					if (this._dpref && this.rowsBuffer[max-1]){
						//we have last row in sett, assuming that we in scrolling up process
						var rows_count = this._dpref?this._dpref:(max-j)
						var start_pos = Math.max(0, Math.min(j, max - this._dpref));
						this._current_load=[start_pos, max-start_pos];
					} else 
						this._current_load=[j,(this._dpref?this._dpref:(max-j))];
					if (this.callEvent("onDynXLS",this._current_load))
						this.load(this.xmlFileUrl+dhtmlx.url(this.xmlFileUrl)+"posStart="+this._current_load[0]+"&count="+this._current_load[1], this._data_type);
				}
				return;
			} else {
               	if (this._tgle){
               		this._updateLine(this._h2.get[this.rowsBuffer[j].idd],this.rowsBuffer[j]);
               		this._updateParentLine(this._h2.get[this.rowsBuffer[j].idd],this.rowsBuffer[j]);
           		}
				if (j && j==(this._realfake?this._fake:this)["_r_select"]){
					this.selectCell(j, this.cell?this.cell._cellIndex:0, true);
				}
			}
        }
	}
	if (this._fake && !this._realfake && this.multiLine) 
		this._fake.objBox.scrollTop = this.objBox.scrollTop;
	*/
	
	/*HSITX*/
	if(!this._realfake){
		this._update_xtrm_srnd_view();
	}
	/**/
	
}
dhtmlXGridObject.prototype._add_from_buffer=function(ind){
	    var row=this.render_row(ind);
	    if (row==-1) return -1;
	    if (row._attrs["selected"] || row._attrs["select"]){
			this.selectRow(row,false,true);
			row._attrs["selected"]=row._attrs["select"]=null;
		}
						
	    if (!this._cssSP){ 
		    if (this._cssEven && ind%2 == 0 )
				row.className=this._cssEven+((row.className.indexOf("rowselected") != -1)?" rowselected ":" ")+(row._css||"");
			else if (this._cssUnEven && ind%2 == 1 )
			    row.className=this._cssUnEven+((row.className.indexOf("rowselected") != -1)?" rowselected ":" ")+(row._css||"");				
			} else if (this._h2) {
				var x=this._h2.get[row.idd];
				row.className+=" "+((x.level%2)?(this._cssUnEven+" "+this._cssUnEven):(this._cssEven+" "+this._cssEven))+"_"+x.level+(this.rowsAr[x.id]._css||"");
			}
			

	    //now we need to get location of node
	    for (var i=0; i<this._fillers.length; i++){
	    	var f=this._fillers[i];
	    	if (f && f[0]<=ind && (f[0]+f[1])>ind ){
	    		//filler found
	    		var pos=ind-f[0];
	    		if (pos==0){
	    			//start
	    			this._insert_before(ind,row,f[2]);
	    			this._update_fillers(i,-1,1);
	    		} else if (pos == f[1]-1){
	    			this._insert_after(ind,row,f[2]);
	    			this._update_fillers(i,-1,0);
	    		} else {
	    			this._fillers.push(this._add_filler(ind+1,f[1]-pos-1,f[2],1));
	    			this._insert_after(ind,row,f[2]);
	    			this._update_fillers(i,-f[1]+pos,0);
	    		}
	    		return;
	    	}
	    }
}
dhtmlXGridObject.prototype._update_fillers=function(ind,right,left){
	var f=this._fillers[ind];
	f[1]=f[1]+right;
	f[0]=f[0]+left;
	if (!f[1]){
		this.callEvent("onRemoveFiller",[f[2]]);
		f[2].parentNode.removeChild(f[2]);
		this._fillers.splice(ind,1);
	} else {
		f[2].firstChild.style.height=parseFloat(f[2].firstChild.style.height)+right*this._srdh+"px";	
		this.callEvent("onUpdateFiller",[f[2]]);
	}
}
dhtmlXGridObject.prototype._insert_before=function(ind,row,fil){
	fil.parentNode.insertBefore(row,fil);
	this.rowsCol[ind]=row;
	this.callEvent("onRowInserted",[row,null,fil,"before"]);
}
dhtmlXGridObject.prototype._insert_after=function(ind,row,fil){
	if (fil.nextSibling)
		fil.parentNode.insertBefore(row,fil.nextSibling);
	else
		fil.parentNode.appendChild(row);
	this.rowsCol[ind]=row;
	this.callEvent("onRowInserted",[row,null,fil,"after"]);
}

/**
*   @desc: enable automatic size saving to cookie
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableAutoSizeSaving = function(name,cookie_param){
		this.attachEvent("onResizeEnd",function(){ this.saveSizeToCookie(name,cookie_param) });
}

/**
*   @desc: store opene state of TreeGrid in cookie
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.saveOpenStates = function(name,cookie_param){
	if (!name) name=this.entBox.id;
	var t=[];
	this._h2.forEachChild(0,function(el){
		if (el.state=="minus") t.push(el.id);
	});
	var str = "gridOpen"+(name||"") + "=" + t.join("|") +  (cookie_param?("; "+cookie_param):"");
	document.cookie = str;
}


/**
*   @desc: load open state of TreeGrid in cookie
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.loadOpenStates = function(name,cookie_param){
	var val=this.getCookie(name,"gridOpen");
	if (!val) return;
	val=val.split("|");
	for (var i = 0; i < val.length; i++) {
		var pid = this.getParentId(val[i]);
		if (!this.getOpenState(pid)) continue;
		this.openItem(val[i]);
	}
}

/**
*   @desc: enable automatic saving column state ( hidden | shown )
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableAutoHiddenColumnsSaving = function(name,cookie_param){
		this.attachEvent("onColumnHidden",function(){ 
				this.saveHiddenColumnsToCookie(name,cookie_param); 
		});
}

/**
*   @desc: enable automatic sorting state saving to cookie
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableSortingSaving = function(name,cookie_param){
	this.attachEvent("onBeforeSorting",function(){ 
		var that=this;
		window.setTimeout(function(){
			that.saveSortingToCookie(name,cookie_param);
			},1);
		return true;
		});	
}

/**
*   @desc: enable automatic column order saving to cookie
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableOrderSaving = function(name,cookie_param){
	this.attachEvent("onAfterCMove",function(){ 
		this.saveOrderToCookie(name,cookie_param);  
		this.saveSizeToCookie(name,cookie_param);
	});
}

/**
*   @desc: enable automatic saving of all possible params
*   @param: name - optional, cookie name
*   @param: cookie_param - additional parameters added to cookie
*   @type: public
*     @edition: Professional
*   @topic: 0
*/
dhtmlXGridObject.prototype.enableAutoSaving = function(name,cookie_param){
		this.enableOrderSaving(name,cookie_param);
		this.enableAutoSizeSaving(name,cookie_param);
		this.enableSortingSaving(name,cookie_param);
}


/**   @desc: save grid layout to cookie
*     @type: public
*     @param: name - optional, cookie name
*     @param: cookie_param - additional parameters added to cookie
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.saveSizeToCookie=function(name,cookie_param){
	if (this.cellWidthType=='px')
		var z=this.cellWidthPX;
	else
		var z=this.cellWidthPC;

	var z2=(this.initCellWidth||[]).join(",");

	if (this._hrrar)
		for (var i = 0; i < this._hrrar.length; i++)
			if (this._hrrar[i]) z[i] = "";
		
	this.setCookie(name,cookie_param,0,z.join(","));
	this.setCookie(name,cookie_param,1,z2);
}

/**   @desc: save hidden columns to cookie
*     @type: public
*     @param: name - optional, cookie name
*     @param: cookie_param - additional parameters added to cookie
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.saveHiddenColumnsToCookie=function(name,cookie_param){

    var hs=[].concat(this._hrrar||[]);
    if (this._fake && this._fake._hrrar)
        for (var i=0; i < this._fake._cCount; i++)
            hs[i]=this._fake._hrrar[i]?"1":"";
	this.setCookie(name,cookie_param,4,hs.join(",").replace(/display:none;/g,"1"));
}

/**   @desc: load sorting order from cookie
*     @type: public
*     @param: name - optional,cookie name
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.loadHiddenColumnsFromCookie=function(name){
	var z=this._getCookie(name,4);
	var ar=(z||"").split(",");
	for (var i=0; i < this._cCount; i++) 
		this.setColumnHidden(i,(ar[i]?true:false));
}



/**   @desc: save sorting order to cookie
*     @type: public
*     @param: name - optional, cookie name
*     @param: cookie_param - additional parameters added to cookie
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.saveSortingToCookie=function(name,cookie_param){
	this.setCookie(name,cookie_param,2,(this.getSortingState()||[]).join(","));
}


/**   @desc: load sorting order from cookie
*     @type: public
*     @param: name - optional,cookie name
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.loadSortingFromCookie=function(name){
	var z=this._getCookie(name,2);
	z=(z||"").split(",");
	if (z.length>1 && z[0]<this._cCount){
		this.sortRows(z[0],null,z[1]);
		this.setSortImgState(true,z[0],z[1]);
	}
}



/**   @desc: save sorting order to cookie
*     @type: public
*     @param: name - optional, cookie name
*     @param: cookie_param - additional parameters added to cookie
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.saveOrderToCookie=function(name,cookie_param){
	if (!this._c_order) {
		this._c_order=[];
		var l=this._cCount;
		for (var i=0; i<l; i++)
			this._c_order[i]=i;
	}
	this.setCookie(name,cookie_param,3,((this._c_order||[]).slice(0,this._cCount)).join(","));
	this.saveSortingToCookie(name, cookie_param);
}


/**   @desc: load sorting order from cookie
*     @type: public
*     @param: name - optional,cookie name
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.loadOrderFromCookie=function(name){
	var z=this._getCookie(name,3);
	z=(z||"").split(",");
	if (z.length>1 && z.length<=this._cCount){
			//code below probably may be optimized
			for (var i=0; i<z.length; i++)
				if ((!this._c_order && z[i]!=i)||(this._c_order && z[i]!=this._c_order[i])){
					var t=z[i];
					if (this._c_order)
						for (var j=0; j<this._c_order.length; j++) {
							if (this._c_order[j]==z[i]) {
								t=j; break;
								}
						}
					this.moveColumn(t*1,i);
				}
	}
}


/**   @desc: load grid layout from cookie
*     @type: public
*     @param: name - optional,cookie name
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.loadSizeFromCookie=function(name){ 
	var z=this._getCookie(name,1);
	if (z)
		this.initCellWidth=z.split(",");
	var z=this._getCookie(name,0);
	if ((z)&&(z.length)){
		z = z.split(",");

		if (!this._fake && this._hrrar) 
			for (var i=0; i<z.length; i++) 
				if (this._hrrar[i]) z[i]=0;

		if (this.cellWidthType=='px')
			this.cellWidthPX=z;
		else
			this.cellWidthPC=z;
		}

	for (var i=0; i<z.length; i++)
		if (z[i] === ""){
			z[i] = this.initCellWidth[i];
			this.setColumnHidden(i, true);
		}

	this.setSizes();
    return true;
}

/**   @desc: clear cookie with grid config details
*     @type: public
*     @param: name - optional,cookie name
*     @edition: Professional
*     @topic: 2
*/
dhtmlXGridObject.prototype.clearConfigCookie=function(name){
	if (!name) name=this.entBox.id;
	var str = "gridSettings"+name + "=||||";
	document.cookie = str;
}
dhtmlXGridObject.prototype.clearSizeCookie=dhtmlXGridObject.prototype.clearConfigCookie;


/**   @desc: save cookie
*     @type: private
*     @param: name - cookie name
*     @param: value - cookie value
*     @param: cookie_param - additional parameters added to cookie
*     @edition: Professional
*     @topic: 0
*/

dhtmlXGridObject.prototype.setCookie=function(name,cookie_param,pos,value) {
	if (!name) name=this.entBox.id;
	var t=this.getCookie(name);
	t=(t||"||||").split("|");
	t[pos]=value;
	var str = "gridSettings"+name + "=" + t.join("|").replace(/,/g,"-") +  (cookie_param?("; "+cookie_param):"");
//	console.log("save",str)
	document.cookie = str;
}

/**   @desc: get cookie
*     @type: private
*     @param: name - cookie name
*     @edition: Professional
*     @topic: 0
*/
dhtmlXGridObject.prototype.getCookie=function(name,surname) { 
	if (!name) name=this.entBox.id;
	name=(surname||"gridSettings")+name;
	var search = name + "=";
	if (document.cookie.length > 0) {
		var offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			var end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			return document.cookie.substring(offset, end);
						}		}
};
dhtmlXGridObject.prototype._getCookie=function(name,pos) {
//	console.log("get",this.getCookie(name))
	return ((this.getCookie(name)||"||||").replace(/-/g,",").split("|"))[pos];
}

function dhtmlXGridFromTable(obj,init){
    if(typeof(obj)!='object')
       obj = document.getElementById(obj);
          var w=document.createElement("DIV");
          w.setAttribute("width",obj.getAttribute("gridWidth")||(obj.offsetWidth?(obj.offsetWidth+"px"):0)||(window.getComputedStyle?window.getComputedStyle(obj,null)["width"]:(obj.currentStyle?obj.currentStyle["width"]:0)));
          w.setAttribute("height",obj.getAttribute("gridHeight")||(obj.offsetHeight?(obj.offsetHeight+"px"):0)||(window.getComputedStyle?window.getComputedStyle(obj,null)["height"]:(obj.currentStyle?obj.currentStyle["height"]:0)));
			w.className = obj.className;
			obj.className="";
			if (obj.id) w.id = obj.id;

          var mr=obj;
          var drag=obj.getAttribute("dragAndDrop");
          mr.parentNode.insertBefore(w,mr);
          var f=mr.getAttribute("name")||("name_"+(new Date()).valueOf());

          var windowf=new dhtmlXGridObject(w);
          window[f]=windowf;

          var acs=mr.getAttribute("onbeforeinit");
          var acs2=mr.getAttribute("oninit");

			if (acs) eval(acs);

      	windowf.setImagePath(windowf.imgURL||(mr.getAttribute("imgpath")|| mr.getAttribute("image_path") ||""));
			var skin = mr.getAttribute("skin");
			if (skin) windowf.setSkin(skin);

      	if (init) init(windowf);

          var hrow=mr.rows[0];
          var za=[];
          var zb="";
          var zc="";
          var zd="";
          var ze="";

          for (var i=0; i<hrow.cells.length; i++){
              za.push(hrow.cells[i].innerHTML);
              var width=hrow.cells[i].getAttribute("width")||hrow.cells[i].offsetWidth||(window.getComputedStyle?window.getComputedStyle(hrow.cells[i],null)["width"]:(hrow.cells[i].currentStyle?hrow.cells[i].currentStyle["width"]:0));
              zb+=(zb?",":"")+(width=="*"?width:parseInt(width));
              zc+=(zc?",":"")+(hrow.cells[i].getAttribute("align")||"left");
              zd+=(zd?",":"")+(hrow.cells[i].getAttribute("type")||"ed");
              ze+=(ze?",":"")+(hrow.cells[i].getAttribute("sort")||"str");
          	var f_a=hrow.cells[i].getAttribute("format");
          	if (f_a)
          		if(hrow.cells[i].getAttribute("type").toLowerCase().indexOf("calendar")!=-1) 
          			windowf._dtmask=f_a;
          		else
          			windowf.setNumberFormat(f_a,i);
          }

      	windowf.setHeader(za);
      	windowf.setInitWidths(zb)
      	windowf.setColAlign(zc)
      	windowf.setColTypes(zd);
      	windowf.setColSorting(ze);
			if (obj.getAttribute("gridHeight")=="auto")
		    	windowf.enableAutoHeigth(true);

			if (obj.getAttribute("multiline")) windowf.enableMultiline(true);

			var lmn=mr.getAttribute("lightnavigation");
			if (lmn) windowf.enableLightMouseNavigation(lmn);

			var evr=mr.getAttribute("evenrow");
			var uevr=mr.getAttribute("unevenrow");

			if (evr||uevr) windowf.enableAlterCss(evr,uevr);
			if (drag) windowf.enableDragAndDrop(true);

          windowf.init();
          if (obj.getAttribute("split")) windowf.splitAt(obj.getAttribute("split"));

          windowf.callEvent("onXLS", []);
          //adding rows
          windowf._process_inner_html(mr,1);
          
			if (acs2) eval(acs2);            
			if (obj.parentNode && obj.parentNode.removeChild)
				obj.parentNode.removeChild(obj);

          windowf.callEvent("onXLE", []);
   return windowf;

          }
dhtmlXGridObject.prototype._process_html=function(xml){
	if (xml.tagName && xml.tagName == "TABLE") return this._process_inner_html(xml,0);
	var temp=document.createElement("DIV");
	temp.innerHTML=xml.xmlDoc.responseText;
	var mr = temp.getElementsByTagName("TABLE")[0];
	this._process_inner_html(mr,0);
}
dhtmlXGridObject.prototype._process_inner_html=function(mr,start){
	var n_l=mr.rows.length;
	for (var j=start; j<n_l; j++){
		var id=mr.rows[j].getAttribute("id")||j;
		this.rowsBuffer.push({ idd:id, data:mr.rows[j], _parser: this._process_html_row, _locator:this._get_html_data });
	}
	this.render_dataset();
	this.setSizes();
}
 
dhtmlXGridObject.prototype._process_html_row=function(r,xml){
	var cellsCol = xml.getElementsByTagName('TD');
  var strAr = [];
  
	r._attrs=this._xml_attrs(xml);
	
	//load cell data
  for(var j=0;j<cellsCol.length;j++){
  	var cellVal=cellsCol[j];
      var exc=cellVal.getAttribute("type");
      if (r.childNodes[j]){
      	if (exc)
      		r.childNodes[j]._cellType=exc;
     		r.childNodes[j]._attrs=this._xml_attrs(cellsCol[j]);
 		}
     
		if (cellVal.firstChild)
		    strAr.push(cellVal.innerHTML);
		else strAr.push("");
      
      if (cellVal.colSpan>1){
          r.childNodes[j]._attrs["colspan"]=cellVal.colSpan;		
          for (var k=1; k<cellVal.colSpan; k++){
              strAr.push("")
          }
      }
		
}
	for(j<cellsCol.length; j<r.childNodes.length; j++)
      r.childNodes[j]._attrs={};

      
  //back to common code
	this._fillRow(r,(this._c_order?this._swapColumns(strAr):strAr));
  return r;
}
dhtmlXGridObject.prototype._get_html_data=function(data,ind){
	data=data.firstChild;
	while (true){
		if (!data) return "";
		if (data.tagName=="TD") ind--;
		if (ind<0) break;
		data=data.nextSibling;
	}
return (data.firstChild?data.firstChild.data:"");
}



dhtmlxEvent(window,"load",function(){
  var z=document.getElementsByTagName("table");
  for (var a=0; a<z.length; a++)
      if (z[a].className=="dhtmlxGrid"){
          dhtmlXGridFromTable(z[a]);
          //we have found IT!
      }
});

/**
*	@desc: enable Undo/Redo functionality in grid
*	@type: public
*	@edition: Professional
*/
dhtmlXGridObject.prototype.enableUndoRedo = function()
{ 
	var self = this;
	var func = function() {return self._onEditUndoRedo.apply(self,arguments);}
	this.attachEvent("onEditCell", func);
	var func2 = function(a,b,c) {return self._onEditUndoRedo.apply(self,[2,a,b,(c?1:0),(c?0:1)]);}		
	this.attachEvent("onCheckbox", func2);
	this._IsUndoRedoEnabled = true;
	this._UndoRedoData = [];
	this._UndoRedoPos = -1;
}
/**
*	@desc: disable Undo/Redo functionality in grid
*	@type: public
*	@edition: Professional
*/
dhtmlXGridObject.prototype.disableUndoRedo = function()
{
	this._IsUndoRedoEnabled = false;
	this._UndoRedoData = [];
	this._UndoRedoPos = -1;
}

dhtmlXGridObject.prototype._onEditUndoRedo = function(stage, row_id, cell_index, new_value, old_value)
{
	if (this._IsUndoRedoEnabled && stage == 2 && old_value != new_value) {
	    if (this._UndoRedoPos !== -1 && this._UndoRedoPos != ( this._UndoRedoData.length-1 ) ) {
	        this._UndoRedoData = this._UndoRedoData.slice(0, this._UndoRedoPos+1);
	    } else if (this._UndoRedoPos === -1 && this._UndoRedoData.length > 0) {
	        this._UndoRedoData = [];
	    }

	    var obj = { old_value:old_value,
	                new_value:new_value,
	                row_id:row_id,
	                cell_index:cell_index
	    };
	    this._UndoRedoData.push(obj);
	    this._UndoRedoPos++;
	}
	return true;
}
/**
*	@desc: UnDo
*	@type: public
*	@edition: Professional
*/
dhtmlXGridObject.prototype.doUndo = function()
{
	if (this._UndoRedoPos === -1)
		return false;
	var obj = this._UndoRedoData[this._UndoRedoPos--];
	var c=this.cells(obj.row_id, obj.cell_index);
	if (this.getColType(obj.cell_index)=="tree")
		c.setLabel(obj.old_value);
	else
		c.setValue(obj.old_value);

	this.callEvent("onUndo", [obj.row_id]);
}
/**
*	@desc: ReDo
*	@type: public
*	@edition: Professional
*/
dhtmlXGridObject.prototype.doRedo = function()
{
	if (this._UndoRedoPos == this._UndoRedoData.length-1)
		return false;
	var obj = this._UndoRedoData[++this._UndoRedoPos];
	this.cells(obj.row_id, obj.cell_index).setValue(obj.new_value);

	this.callEvent("onUndo", [obj.row_id]);
}
/**
*	@desc: get length of available ReDo operations
*	@type: public
*	@edition: Professional
*/
dhtmlXGridObject.prototype.getRedo = function()
{
	if (this._UndoRedoPos == this._UndoRedoData.length-1)
		return [];
	return this._UndoRedoData.slice(this._UndoRedoPos+1);
}
/**
*	@desc: get length of available UnDo operations
*	@type: public
*	@edition: Professional
*/
dhtmlXGridObject.prototype.getUndo = function()
{
	if (this._UndoRedoPos == -1)
		return [];
	return this._UndoRedoData.slice(0, this._UndoRedoPos+1);
}

//validation
if (typeof(window.dhtmlxValidation) != "undefined") {
	dhtmlxValidation.trackInput = function(el,rule,callback_error,callback_correct) {
		dhtmlxEvent(el, "keyup", function(e){
			if (dhtmlxValidation._timer) {
				window.clearTimeout(dhtmlxValidation._timer);
				dhtmlxValidation._timer = null;
			}
			dhtmlxValidation._timer = window.setTimeout(function(){
				if (!dhtmlxValidation.checkInput(el,rule)){
					if (!callback_error || callback_error(el,el.value,rule)) el.className += " dhtmlx_live_validation_error";
				} else {
					el.className=el.className.replace(/[ ]*dhtmlx_live_validation_error/g,"");
					if (callback_correct) callback_correct(el, el.value, rule);
				}
			},250);
		});
	};
	dhtmlxValidation.checkInput = function(input,rule) {
		return dhtmlxValidation.checkValue(input.value,rule);
	};
	dhtmlxValidation.checkValue = function(value,rule) {
		if (typeof rule=="string") rule = rule.split(",");
		var final_res = true;
		for (var i=0; i<rule.length; i++) {
			if (!this["is"+rule[i]]) {
				alert("Incorrect validation rule: "+rule[i]);
			} else {
				final_res = final_res && this["is"+rule[i]](value);
			}
		}
		return final_res;
	};
};
// extension for the grid
dhtmlXGridObject.prototype.enableValidation=function(mode,live){
	mode=dhx4.s2b(mode);
	if (mode) this._validators = {data:[]}; else this._validators = false;
	if (arguments.length>1) this._validators._live=live;
	if (!this._validators._event) this._validators._event=this.attachEvent("onEditCell",this.validationEvent);
};
dhtmlXGridObject.prototype.setColValidators=function(vals){
	if (!this._validators) this.enableValidation(true);
	if (typeof vals == "string") vals=vals.split(this.delim);
	this._validators.data=vals;
};
dhtmlXGridObject.prototype.validationEvent=function(stage,id,ind,newval,oldval){
	var v=this._validators;
	if (!v) return true; // validators disabled
	var rule=(v.data[ind]||this.cells(id,ind).getAttribute("validate"))||"";
	
	if (stage==1 && rule) {
		var ed = this.editor||(this._fake||{}).editor;
		if (!ed) return true; //event was trigered by checkbox
		ed.cell.className=ed.cell.className.replace(/[ ]*dhtmlx_validation_error/g,"");
		if (v._live){
			var grid=this;
			dhtmlxValidation.trackInput(ed.getInput(),rule,function(element,value,rule){
				return grid.callEvent("onLiveValidationError",[id,ind,value,element,rule]);
			}, function(element,value,rule){
				return grid.callEvent("onLiveValidationCorrect",[id,ind,value,element,rule]);
			});
		}
	}
	
	if (stage==2) this.validateCell(id,ind,rule,newval);
	
	return true;
};

dhtmlXGridObject.prototype.validateCell=function(id,ind,rule,value){
	rule=rule||(this._validators.data[ind]||this.cells(id,ind).getAttribute("validate"));
	value=value||this.cells(id,ind).getValue();
	if (!rule) return;
	var cell = this.cells(id,ind).cell;
	
	var result = true;
	if (typeof rule == "string")
		rule = rule.split(this.delim);
	
	for (var i=0; i < rule.length; i++) {
		if (!dhtmlxValidation.checkValue(value,rule[i])){
			if (this.callEvent("onValidationError",[id,ind,value,rule[i]]))
				cell.className+=" dhtmlx_validation_error";
			result = false;
		}
	}
	if (result){
		this.callEvent("onValidationCorrect",[id,ind,value,rule]);
		cell.className=cell.className.replace(/[ ]*dhtmlx_validation_error/g,"");		
	}
	return result;
};

/**
*	@desc: skined checkbox editor 
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_acheck(cell){
	try{
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
		this.cell.obj = this;
	}catch(er){}
	this.changeState = function(){
		//nb:
		    if ((!this.grid.isEditable)||(this.cell.parentNode._locked)||(this.isDisabled())) return;
			if(this.grid.callEvent("onEditCell",[0,this.cell.parentNode.idd,this.cell._cellIndex])!=false){
				this.val = this.getValue()
				if(this.val=="1")
					this.setValue("<checkbox state='false'>")
				else
					this.setValue("<checkbox state='true'>")
					
				this.cell.wasChanged=true;								
				//nb:
				this.grid.callEvent("onEditCell",[1,this.cell.parentNode.idd,this.cell._cellIndex]);
				this.grid.callEvent("onCheck",[this.cell.parentNode.idd,this.cell._cellIndex,(this.val!='1')]);
                this.grid.callEvent("onCheckbox",[this.cell.parentNode.idd,this.cell._cellIndex,(this.val!='1')]);

			}else{//preserve editing (not tested thoroughly for this editor)
				this.editor=null;
			}
	}
	this.getValue = function(){
		try{
			return this.cell.chstate.toString();
		}catch(er){
			return null;
		}
	}

	this.isCheckbox = function(){
		return true;
	}
	this.isChecked = function(){
		if(this.getValue()=="1")
			return true;
		else
			return false;
	}
	this.setChecked = function(fl){
	this.setValue(fl.toString())
	}
	this.detach = function(){
		return this.val!=this.getValue();
	}
    this.drawCurrentState=function(){
        if (this.cell.chstate==1)
            return "<div  onclick='(new eXcell_acheck(this.parentNode)).changeState(); (arguments[0]||event).cancelBubble=true;'  style='cursor:pointer; font-weight:bold; text-align:center; '><span style='height:8px; width:8px; background:green; display:inline-block;'></span>&nbsp;Yes</div>";
        else
            return "<div  onclick='(new eXcell_acheck(this.parentNode)).changeState(); (arguments[0]||event).cancelBubble=true;' style='cursor:pointer;  text-align:center; '><span style='height:8px; width:8px; background:red; display:inline-block;'></span>&nbsp;No</div>";
    }
}
eXcell_acheck.prototype = new eXcell;
eXcell_acheck.prototype.setValue = function(val){
    //val can be int
    val=(val||"").toString();
	if(val.indexOf("1")!=-1 || val.indexOf("true")!=-1){
		val = "1";
		this.cell.chstate = "1";
	}else{
		val = "0";
		this.cell.chstate = "0"
	}
	var obj = this;
	this.setCValue(this.drawCurrentState(),this.cell.chstate);
}

/**
*	@desc: calculator editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_calck(cell){
	try{
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}catch(er){}
	this.edit = function(){
		this.val = this.getValue();

		var arPos = this.grid.getPosition(this.cell);
		this.obj = new calcX(arPos[0],arPos[1]+this.cell.offsetHeight,this,this.val);

	}
	this.getValue = function(){
		//this.grid.editStop();
    	return this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(),this.cell._cellIndex);
	}
	this.detach = function(){
        if (this.obj) {
			this.setValue(this.obj.inputZone.value);
			this.obj.removeSelf();
			}
        this.obj=null;
		return this.val!=this.getValue();
	}
}
eXcell_calck.prototype = new eXcell;
eXcell_calck.prototype.setValue = function(val){
      if(!val || val.toString()._dhx_trim()=="")
          val="0"
      this.setCValue(this.grid._aplNF(val,this.cell._cellIndex),val);
}

function calcX(left,top,onReturnSub,val){
	this.top=top||0;
	this.left=left||0;
	this.onReturnSub=onReturnSub||null;

	this.operandA=0;
	this.operandB=0;
	this.operatorA="";
	this.state=0;
	this.dotState=0;


this.calckGo=function(){
	return (eval(this.operandA+"*1"+this.operatorA+this.operandB+"*1"));
};

this.isNumeric=function(str){
	return ((str.search(/[^1234567890]/gi)==-1)?(true):(false));
};
this.isOperation=function(str){
	return ((str.search(/[^\+\*\-\/]/gi)==-1)?(true):(false));
}
	this.onCalcKey=function(e)
	{
		that=this.calk;
		var z=this.innerHTML;
		var rZone=that.inputZone;
		if (((that.state==0)||(that.state==2))&&(that.isNumeric(z)))  	if (rZone.value!="0") rZone.value+=z; else rZone.value=z;
		if ((((that.state==0)||(that.state==2))&&(z=='.'))&&(that.dotState==0)) { that.dotState=1; rZone.value+=z; }
		if ((z=="C"))  { rZone.value=0; that.dotState=0; that.state=0; }
		if ((that.state==0)&&(that.isOperation(z)))  { that.operatorA=z;  that.operandA=rZone.value; that.state=1; }
		if ((that.state==2)&&(that.isOperation(z)))  { that.operandB=rZone.value; rZone.value=that.calckGo(); that.operatorA=z;  that.operandA=rZone.value; that.state=1; }
		if ((that.state==2)&&(z=="="))  { that.operandB=rZone.value; rZone.value=that.calckGo(); that.operatorA=z;  that.operandA=rZone.value; that.state=3; }
		if ((that.state==1)&&(that.isNumeric(z))) { rZone.value=z; that.state=2;  that.dotState=0 }
		if ((that.state==3)&&(that.isNumeric(z))) { rZone.value=z; that.state=0; }
		if ((that.state==3)&&(that.isOperation(z))) { that.operatorA=z;  that.operandA=rZone.value; that.state=1; }
		if (z=="e") { rZone.value=Math.E;  if (that.state==1) that.state=2; that.dotState=0   }
		if (z=="p") { rZone.value=Math.PI; if (that.state==1) that.state=2; that.dotState=0  }
		if (z=="Off") that.topNod.parentNode.removeChild(that.topNod);

		if (e||event) (e||event).cancelBubble=true;
	}
	this.sendResult=function(){
		that=this.calk;
		if (that.state==2){
            var rZone=that.inputZone;
            that.operandB=rZone.value;
            rZone.value=that.calckGo();
            that.operatorA=z;
            that.operandA=rZone.value;
            that.state=3; }
		var z=that.inputZone.value;

		that.topNod.parentNode.removeChild(that.topNod);
		that.onReturnSub.grid.editStop(false);
	};
    this.removeSelf=function(){
        if (this.topNod.parentNode)
        	this.topNod.parentNode.removeChild(this.topNod);
    }
	this.keyDown=function(){ this.className="calcPressed"; };
	this.keyUp=function(){ this.className="calcButton"; };
	this.init_table=function(){
		var table=this.topNod.childNodes[0];
		if ((!table)||(table.tagName!="TABLE")) return;
		for (i=1; i<table.childNodes[0].childNodes.length; i++)
			for (j=0; j<table.childNodes[0].childNodes[i].childNodes.length; j++)
			{
				table.childNodes[0].childNodes[i].childNodes[j].onclick=this.onCalcKey;
				table.childNodes[0].childNodes[i].childNodes[j].onmousedown=this.keyDown;
				table.childNodes[0].childNodes[i].childNodes[j].onmouseout=this.keyUp;
				table.childNodes[0].childNodes[i].childNodes[j].onmouseup=this.keyUp;
				table.childNodes[0].childNodes[i].childNodes[j].calk=this;
			}
		this.inputZone=this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		if (this.onReturnSub)
		{
			this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].onclick=this.sendResult;
			this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].calk=this;
		}
		else this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerHTML="";
	}
	this.drawSelf=function(){
		var div=document.createElement("div");
		div.className="calcTable";
		div.style.position="absolute";
		div.style.top=this.top+"px";
		div.style.left=this.left+"px";
		div.innerHTML="<table cellspacing='0' id='calc_01' class='calcTable'><tr><td colspan='4'><table cellpadding='1' cellspacing='0' width='100%'><tr><td width='100%' style='overflow:hidden;'><input style='width:100%' class='calcInput' value='0' align='right' readonly='true' style='text-align:right'></td><td class='calkSubmit'>=</td></tr></table></td></tr><tr><td class='calcButton' width='25%'>Off</td><td class='calcButton' width='25%'>p</td><td class='calcButton' width='25%'>e</td><td class='calcButton' width='25%'>/</td></tr><tr><td class='calcButton'>7</td><td class='calcButton'>8</td><td class='calcButton'>9</td><td class='calcButton'>*</td></tr><tr><td class='calcButton'>4</td><td class='calcButton'>5</td><td class='calcButton'>6</td><td class='calcButton'>+</td></tr><tr><td class='calcButton'>1</td><td class='calcButton'>2</td><td class='calcButton'>3</td><td class='calcButton'>-</td></tr><tr><td class='calcButton'>0</td><td class='calcButton'>.</td><td class='calcButton'>C</td><td class='calcButton'>=</td></tr></table>";
		div.onclick=function(e){ (e||event).cancelBubble=true; };
		document.body.appendChild(div);
		this.topNod=div;
	}

	this.drawSelf();
	this.init_table();

    if (val){
            var rZone=this.inputZone;
            rZone.value=val*1;
            this.operandA=val*1;
            this.state=3;
            }
	return this;
};

/**
*	@desc: multi select list editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_clist(cell){
	try{
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}catch(er){}
	this.edit = function(){
		this.val = this.getValue();
        var a=(this.cell._combo||this.grid.clists[this.cell._cellIndex]);
        if (!a) return;
		this.obj = document.createElement("DIV");
        var b=this.val.split(",");
        var text="";

        for (var i=0; i<a.length; i++){
            var fl=false;
            for (var j=0; j<b.length; j++)
                if (a[i]==b[j]) fl=true;
            if (fl)
             text+="<div><input type='checkbox' id='dhx_clist_"+i+"' checked='true' /><label for='dhx_clist_"+i+"'>"+a[i]+"</label></div>";
            else
             text+="<div><input type='checkbox' id='dhx_clist_"+i+"'/><label for='dhx_clist_"+i+"'>"+a[i]+"</label></div>";
        }
        text+="<div><input type='button' value='"+(this.grid.applyButtonText||"Apply")+"' style='width:100px; font-size:8pt;' onclick='this.parentNode.parentNode.editor.grid.editStop();'/></div>"

        this.obj.editor=this;
        this.obj.innerHTML=text;
        document.body.appendChild(this.obj);
        this.obj.style.position="absolute";
		this.obj.className="dhx_clist";
		this.obj.onclick=function(e){  (e||event).cancelBubble=true; return true; };
		var arPos = this.grid.getPosition(this.cell);
        this.obj.style.left=arPos[0]+"px";
        this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";

        this.obj.getValue=function(){
            var text="";
            for (var i=0; i<this.childNodes.length-1; i++)
                if (this.childNodes[i].childNodes[0].checked){
                    if (text) text+=", ";
                        text+=this.childNodes[i].childNodes[1].innerHTML;
                    }
            return text.replace(/&amp;/g,"&");
        }
	}
	this.getValue = function(){
		//this.grid.editStop();
		if (this.cell._clearCell) return "";
		return this.cell.innerHTML.toString()._dhx_trim().replace(/&amp;/g,"&").replace(/, /g, ",");
	}

	this.detach = function(val){
        if (this.obj){
			this.setValue(this.obj.getValue());
            this.obj.editor=null;
            this.obj.parentNode.removeChild(this.obj);
            this.obj=null;
            }
		return this.val!=this.getValue();
	}
}
eXcell_clist.prototype = new eXcell;

eXcell_clist.prototype.setValue = function(val){
	if (typeof(val)=="object"){
		var optCol=dhx4.ajax.xpath("./option",val);
        if (optCol.length)
        	this.cell._combo=[];
            for (var j=0;j<optCol.length; j++)
				this.cell._combo.push(optCol[j].firstChild?optCol[j].firstChild.data:"");
		val=val.firstChild.data;
	}
	if (val==="" || val === this.undefined){
		this.setCTxtValue(" ",val);
		this.cell._clearCell=true;
	}
	else{
        val = val.replace(/,[ ]*/g, ", ");
    	this.setCTxtValue(val);
    	this.cell._clearCell=false;
    }
}

/**
*	@desc: register list of values for CList cell
*	@param: col - index of CList collumn
*	@param: list - array of list data
*	@type:  public
*   @edition: Professional
*/
dhtmlXGridObject.prototype.registerCList=function(col,list){
    if (!this.clists) this.clists=new Array();
	if (typeof(list)!="object") list=list.split(",");
    this.clists[col]=list;
}

/**
*	@desc: auto counter editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_cntr(cell){
	this.cell = cell;
    this.grid = this.cell.parentNode.grid;
	if (!this.grid._ex_cntr_ready && !this._realfake){
		this.grid._ex_cntr_ready=true;
		if (this.grid._h2)
			this.grid.attachEvent("onOpenEn",function(id){
				this.resetCounter(cell._cellIndex);
			});
		var fix_cnt = function(){ 
			var that=this;
			window.setTimeout(function(){ 
				if (!that.resetCounter) return;
				if (that._fake && !that._realfake && cell._cellIndex<that._fake._cCount) 
					that._fake.resetCounter(cell._cellIndex); 
				else
				    that.resetCounter(cell._cellIndex);
			},1);
			return true;
		};

		this.grid.attachEvent("onBeforeSorting", fix_cnt);
		this.grid.attachEvent("onFilterEnd", fix_cnt);
	}
	
	

	this.edit = function(){}
	this.getValue = function(){
		return this.cell.innerHTML;
	}
	this.setValue = function(val){
		this.cell.style.paddingRight = "2px";
		var cell=this.cell;
		
		window.setTimeout(function(){
			if (!cell.parentNode) return;
			var val=cell.parentNode.rowIndex;
			if (cell.parentNode.grid.currentPage || val<0 || cell.parentNode.grid._srnd) val=cell.parentNode.grid.rowsBuffer._dhx_find(cell.parentNode)+1;
			if (val<=0) return;
			cell.innerHTML = val;
			if (cell.parentNode.grid._fake && cell._cellIndex<cell.parentNode.grid._fake._cCount && cell.parentNode.grid._fake.rowsAr[cell.parentNode.idd]) cell.parentNode.grid._fake.cells(cell.parentNode.idd,cell._cellIndex).setCValue(val);
			cell=null;
		},100);
	}
}
dhtmlXGridObject.prototype.resetCounter=function(ind){
	if (this._fake && !this._realfake && ind < this._fake._cCount) this._fake.resetCounter(ind,this.currentPage);
	var i=arguments[0]||0;
	if (this.currentPage)
		i=(this.currentPage-1)*this.rowsBufferOutSize;
	for (i=0; i<this.rowsBuffer.length; i++)
		if (this.rowsBuffer[i] && this.rowsBuffer[i].tagName == "TR" && this.rowsAr[this.rowsBuffer[i].idd])
			this.rowsAr[this.rowsBuffer[i].idd].childNodes[ind].innerHTML=i+1;
}
eXcell_cntr.prototype = new eXcell;

dhx4.attachEvent("onGridCreated", function(grid){
	if (!window.dhx_globalImgPath) window.dhx_globalImgPath = grid.imgURL;
	
	grid._col_combos = [];
	for (var i=0; i<grid._cCount; i++) {
		if(grid.cellType[i].indexOf("combo") == 0) {
			grid._col_combos[i] = eXcell_combo.prototype.initCombo.call({grid:grid},i);
		}
	}
	
	if (!grid._loading_handler_set) {
		grid._loading_handler_set = grid.attachEvent("onXLE", function(a,b,c,xml,type){
				if (type != "xml") return;
				eXcell_combo.prototype.fillColumnCombos(this,xml);
				this.detachEvent(this._loading_handler_set);
				this._loading_handler_set = null;
		});
	}
});


function eXcell_combo(cell) {
	
	if (!cell) return;
	
	this.cell = cell;
	this.grid = cell.parentNode.grid;
	this._combo_pre = "";
	
	this.edit = function(){
		if (!window.dhx_globalImgPath) window.dhx_globalImgPath = this.grid.imgURL;
		
		this.val = this.getValue();
		var val = this.getText();
		if (this.cell._clearCell) val="";
		this.cell.innerHTML = "";
		
		if (!this.cell._brval) {
			this.combo = (this.grid._realfake?this.grid._fake:this.grid)._col_combos[this.cell._cellIndex];
		} else {
			this.combo = this.cell._brval;
		}
		this.cell.appendChild(this.combo.DOMParent);

		this.combo.DOMParent.style.margin = "0";
		
		this.combo.DOMelem_input.focus();
		this.combo.setSize(this.cell.offsetWidth-2);
		if (!this.combo._xml) {
			if (this.combo.getIndexByValue(this.cell.combo_value)!=-1) {
				this.combo.selectOption(this.combo.getIndexByValue(this.cell.combo_value));
			} else {
				if (this.combo.getOptionByLabel(val)) {
					this.combo.selectOption(this.combo.getIndexByValue(this.combo.getOptionByLabel(val).value));
				} else {
					this.combo.unSelectOption();
				}
			}
		} else {
			this.combo.setComboText(val);
		}
		this.combo.openSelect();
	}
	
	this.selectComboOption = function(val,obj){
		obj.selectOption(obj.getIndexByValue(obj.getOptionByLabel(val).value));
	}
	
	this.getValue = function(val){
		return this.cell.combo_value||"";
	}
	
	this.getText = function(val){
		var c = this.cell;
		if (this._combo_pre == "" && c.childNodes[1]) {
			c = c.childNodes[1];
		} else {
			c.childNodes[0].childNodes[1];
		}
		return (_isIE ? c.innerText : c.textContent);
	}
	
	this.setValue = function(val){
		
		if (typeof(val) == "object"){
			
			this.cell._brval = this.initCombo();
			var index = this.cell._cellIndex;
			var idd = this.cell.parentNode.idd;
			if (!val.firstChild) {
				this.cell.combo_value = "&nbsp;";
				this.cell._clearCell = true;
			} else {
				this.cell.combo_value = val.firstChild.data;
			}
			this.setComboOptions(this.cell._brval, val, this.grid, index, idd);
			
		} else {
			this.cell.combo_value = val;
			var cm = null;
			if ((cm = this.cell._brval) && (typeof(this.cell._brval) == "object")) {
				val = (cm.getOption(val)||{}).text||val;
			} else if (cm = this.grid._col_combos[this.cell._cellIndex]||((this.grid._fake) && (cm = this.grid._fake._col_combos[this.cell._cellIndex]))) {
				val = (cm.getOption(val)||{}).text||val;
			}
			
			if ((val||"").toString()._dhx_trim()=="") val = null;
			
			if (val !== null) {
				this.setComboCValue(val);
			} else {
				this.setComboCValue("&nbsp;", "");
				this.cell._clearCell = true;
			}
		}
	}
	
	this.detach = function(){
		var p = this.combo.getParent();
		if (p.parentNode == this.cell) {
			this.cell.removeChild(p);
		} else {
			return false;
		}
		var val = this.cell.combo_value;
		this.combo._confirmSelect("blur");
		
		if (!this.combo.getComboText() || this.combo.getComboText().toString()._dhx_trim()=="") {
			this.setComboCValue("&nbsp;");
			this.cell._clearCell=true;
		} else {
			this.setComboCValue(this.combo.getComboText().replace(/\&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),this.combo.getActualValue());
			this.cell._clearCell = false;
		}
		
		this.cell.combo_value = this.combo.getActualValue();
		this.combo.closeAll();
		this.grid._still_active=true;
		this.grid.setActive(1);
		return val!=this.cell.combo_value;
	}
}


eXcell_combo.prototype = new eXcell;
eXcell_combo_v = function(cell){
	var combo = new eXcell_combo(cell);
	combo._combo_pre = "<img src='"+(window.dhx_globalImgPath?window.dhx_globalImgPath:this.grid.imgURL)+"combo_select"+(dhtmlx.skin?"_"+dhtmlx.skin:"")+".gif' class='dhxgrid_combo_icon'/>";
	return combo;
};

eXcell_combo.prototype.initCombo = function(index){
	
	var container = document.createElement("DIV");
	container.className = "dhxcombo_in_grid_parent";
	var type = this.grid.defVal[arguments.length?index:this.cell._cellIndex];
	var combo = new dhtmlXCombo(container, "combo", 0, type);
	this.grid.defVal[arguments.length?index:this.cell._cellIndex] = "";
	
	var grid = this.grid;
	combo.DOMelem.onmousedown = combo.DOMelem.onclick = function(e){
		e = e||event;
		e.cancelBubble = true;
	};
	combo.DOMelem.onselectstart = function(e){
		e = e||event;
		e.cancelBubble = true;
		return true;
	};
	
	this.grid.attachEvent("onScroll", function(){
		if (combo._isListVisible()) combo._hideList();
	});
	
	combo.attachEvent("onKeyPressed",function(ev){
		if (ev==13 || ev==27) {
			grid.editStop();
			if (grid._fake) grid._fake.editStop();
		}
	});
	
	return combo;
	
};

eXcell_combo.prototype.fillColumnCombos = function(grid,xml){
	if (!xml) return;
	var top  = dhx4.ajax.xmltop("rows", xml, -1);
	if (top && top.tagName !== "DIV"){
		grid.combo_columns = grid.combo_columns||[];
		columns = dhx4.ajax.xpath("//column", top);
		for (var i=0; i<columns.length; i++) {
			if ((columns[i].getAttribute("type")||"").indexOf("combo") == 0) {
				grid.combo_columns[grid.combo_columns.length] = i;
				this.setComboOptions(grid._col_combos[i], columns[i], grid, i);
			}
		}
	}
};

eXcell_combo.prototype.setComboCValue = function(value, value2) {
   	if (this._combo_pre != "") {
		var height = (this.cell.offsetHeight?this.cell.offsetHeight+"px":0);
   		value = "<div style='width:100%;position:relative;height:100%;overflow:hidden;'>"+this._combo_pre+"<span>"+value+"</span></div>";
   	}
   	if (arguments.length > 1) {
  		this.setCValue(value,value2);
	} else {
		this.setCValue(value);
	}
};

eXcell_combo.prototype.setComboOptions = function(combo, obj, grid, index, idd) {
	
	if (window.dhx4.s2b(obj.getAttribute("xmlcontent"))) {
		
		if (!obj.getAttribute("source")) {
			options = obj.childNodes;
			var _optArr = [];
			for (var i=0; i < options.length; i++){
				if(options[i].tagName =="option"){
					var text_opt = options[i].firstChild? options[i].firstChild.data:"";
					_optArr[_optArr.length]= [options[i].getAttribute("value"),text_opt, (options[i].getAttribute("css")||"")];
				}
			}
			combo.addOption(_optArr)
			if(arguments.length == 4){
				grid.forEachRowA(function(id){
						var c = grid.cells(id,index);
						if(!c.cell._brval&&!c.cell._cellType&&(c.cell._cellIndex==index)){
							if(c.cell.combo_value=="") c.setComboCValue("&nbsp;","");
							else{
								if(!combo.getOption(c.cell.combo_value))
									c.setComboCValue(c.cell.combo_value);
								else c.setComboCValue(combo.getOption(c.cell.combo_value).text, c.cell.combo_value);
							}
						}
				});	
			}
			else {
				var c = (this.cell)?this:grid.cells(idd,index);
				if(obj.getAttribute("text")) {
					if(obj.getAttribute("text")._dhx_trim()=="") c.setComboCValue("&nbsp;",""); 
					else c.setComboCValue(obj.getAttribute("text")); 
				}
				else{
					if((!c.cell.combo_value)||(c.cell.combo_value._dhx_trim()=="")) c.setComboCValue("&nbsp;","");
					else{
						if(!combo.getOption(c.cell.combo_value))
							c.setComboCValue(c.cell.combo_value);
						else c.setComboCValue(combo.getOption(c.cell.combo_value).text, c.cell.combo_value);
					}
				}
			}
			
		}
	}
	
	if (obj.getAttribute("source")) {
		if (obj.getAttribute("auto") && window.dhx4.s2b(obj.getAttribute("auto"))) {
			
			if (obj.getAttribute("xmlcontent")) {
				var c = (this.cell)?this:grid.cells(idd,index);
				if (obj.getAttribute("text")) c.setComboCValue(obj.getAttribute("text"));
			} else {
				grid.forEachRowA(function(id){
					var c = grid.cells(id,index);
					if (!c.cell._brval && !c.cell._cellType) {
						var str = c.cell.combo_value.toString();
						if (str.indexOf("^") != -1) {
							var arr = str.split("^");
							c.cell.combo_value = arr[0];
							c.setComboCValue(arr[1]);
						}
					}
				});
			}
			combo.enableFilteringMode(true, obj.getAttribute("source"), window.dhx4.s2b(obj.getAttribute("cache")||true), window.dhx4.s2b(obj.getAttribute("sub")||false));
			
		} else {
			
			var that = this;
			var length = arguments.length; 
			combo.load(obj.getAttribute("source"), function(){
				if (length == 4) {
					grid.forEachRow(function(id){
						var c = grid.cells(id,index);
						if (!c.cell._brval && !c.cell._cellType) {
							if (combo.getOption(c.cell.combo_value)) {
								c.setComboCValue(combo.getOption(c.cell.combo_value).text, c.cell.combo_value);
							} else {
								if ((c.cell.combo_value||"").toString()._dhx_trim() == "") {
									c.setComboCValue("&nbsp;","");
									c.cell._clearCell=true;
								} else {
									c.setComboCValue(c.cell.combo_value);
								}
							}
						}
					});
				} else {
					//var c = (that.cell)? that : grid.cells(idd,index);
					var c = grid.cells(idd,index);
					//c.setCValue(obj.getAttribute("text"));
					if (combo.getOption(c.cell.combo_value)) {
						c.setComboCValue(combo.getOption(c.cell.combo_value).text, c.cell.combo_value);
					} else {
						c.setComboCValue(c.cell.combo_value);
					}
				}
			});
			
		}
	}
	if (!obj.getAttribute("auto") || !window.dhx4.s2b(obj.getAttribute("auto"))) {
		if (obj.getAttribute("editable") && !window.dhx4.s2b(obj.getAttribute("editable"))) combo.readonly(true);
		if (obj.getAttribute("filter") && window.dhx4.s2b(obj.getAttribute("filter"))) combo.enableFilteringMode(true);
	}
	
};

eXcell_combo.prototype.getCellCombo = function() {
	
	if (this.cell._brval) return this.cell._brval;
	
	this.cell._brval = this.initCombo();
	return this.cell._brval;
	
};

eXcell_combo.prototype.refreshCell = function() {
	this.setValue(this.getValue());
};

dhtmlXGridObject.prototype.getColumnCombo = function(index) {
	if (this._col_combos && this._col_combos[index]) return this._col_combos[index];
	
	if (!this._col_combos) this._col_combos = [];
	this._col_combos[index] = eXcell_combo.prototype.initCombo.call({grid:this},index);
	return this._col_combos[index];
	
};

dhtmlXGridObject.prototype.refreshComboColumn = function(index) {
	this.forEachRow(function(id){
		if (this.cells(id,index).refreshCell) this.cells(id,index).refreshCell();
	});
};

function eXcell_context(cell){
	if (cell){
		this.cell = cell;
    	this.grid = this.cell.parentNode.grid;
    
    	if (!this.grid._sub_context) return;
    	this._sub=this.grid._sub_context[cell._cellIndex];
    	if (!this._sub) return;
    	this._sindex=this._sub[1];
    	this._sub=this._sub[0];
    }
	
	this.getValue = function(){
		return _isIE?this.cell.innerText:this.cell.textContent;
	}
	this.setValue = function(val){
		this.cell._val=val;
		var item  = this._sub.itemPull[this._sub.idPrefix+this.cell._val];
		val = item?item.title:val;
		this.setCValue((val||"&nbsp;"),val);
	}
	this.edit = function(){
		var arPos = this.grid.getPosition(this.cell);//,this.grid.objBox
		
		this._sub.showContextMenu(arPos[0]+this.cell.offsetWidth,arPos[1]);
		var a=this.grid.editStop;
		this.grid.editStop=function(){};
		this.grid.editStop=a;
	}
	this.detach=function(){
		if (this.grid._sub_id != null) {
			var old=this.cell._val;
			this.setValue(this.grid._sub_id);
			this.grid._sub_id = null;
			return this.cell._val!=old;
		}
		this._sub.hideContextMenu();
	}
}
eXcell_context.prototype = new eXcell;


dhtmlXGridObject.prototype.setSubContext=function(ctx,s_index,t_index){
	var that=this;
	ctx.attachEvent("onClick",function(id,value){
		that._sub_id = id;
		that.editStop();
		ctx.hideContextMenu();
		return true;
	});
	if (!this._sub_context) 
		this._sub_context=[];
	this._sub_context[s_index]=[ctx,t_index];
	ctx.hideContextMenu();
};

//Combobox
function eXcell_cor(cell){
        if (cell){
      this.cell = cell;
      this.grid = this.cell.parentNode.grid;
      this.combo = this.grid.getCombo(this.cell._cellIndex);
      this.editable = true
   }
    this.shiftNext=function(){

        var z=this.list.options[this.list.selectedIndex+1];
        if (z) z.selected=true;
        this.obj.value=this.list.value;

        return true;
    }
    this.shiftPrev=function(){

        var z=this.list.options[this.list.selectedIndex-1];
        if (z) z.selected=true;

        this.obj.value=this.list.value;

       return true;
    }

   this.edit = function(){
      this.val = this.getValue();
      this.text = this.cell.innerHTML._dhx_trim();
      var arPos = this.grid.getPosition(this.cell)//,this.grid.objBox)

      this.obj = document.createElement("TEXTAREA");
            this.obj.className="dhx_combo_edit";
      this.obj.style.height=(this.cell.offsetHeight-4)+"px";

         this.obj.wrap = "soft";
         this.obj.style.textAlign = this.cell.align;
         this.obj.onclick = function(e){(e||event).cancelBubble = true}
         this.obj.value = this.text

                this.list =  document.createElement("SELECT");
               this.list.editor_obj = this;
                this.list.className='dhx_combo_select';
                this.list.style.width=this.cell.offsetWidth+"px";
         this.list.style.left = arPos[0]+"px";//arPos[0]
         this.list.style.top = arPos[1]+this.cell.offsetHeight+"px";//arPos[1]+this.cell.offsetHeight;
         this.list.onclick = function(e){
              var ev = e||window.event;
              var cell = ev.target||ev.srcElement
                            //tbl.editor_obj.val=cell.combo_val;
                            if (cell.tagName=="OPTION") cell=cell.parentNode;
			  if (cell.value!=-1){
				  cell.editor_obj._byClick=true;
                //  cell.editor_obj.setValue(cell.value);
                  cell.editor_obj.editable=false;
                  cell.editor_obj.grid.editStop();
				  }
              else {
			  	ev.cancelBubble=true;
				cell.editor_obj.obj.value="";											
				cell.editor_obj.obj.focus();
				}
           }
         var comboKeys = this.combo.getKeys();

         var selOptId=0;

		 this.list.options[0]=new Option(this.combo.get(comboKeys[0]),comboKeys[0]);
		 this.list.options[0].selected=true;

         for(var i=1;i<comboKeys.length;i++){
               var val = this.combo.get(comboKeys[i])
                        this.list.options[this.list.options.length]=new Option(val,comboKeys[i]);
                        if(comboKeys[i]==this.val)
                            selOptId=this.list.options.length-1;
                        }

      document.body.appendChild(this.list)//nb:this.grid.objBox.appendChild(this.listBox);
            this.list.size="6";
            this.cstate=1;
      if(this.editable){
         this.cell.innerHTML = "";
      } else {
        this.obj.style.width="1px";
        this.obj.style.height="1px";
        }
         this.cell.appendChild(this.obj);
                this.list.options[selOptId].selected=true;
         //fix for coro - FF scrolls grid in incorrect position
         if (this.editable){
               this.obj.focus();
                  this.obj.focus();
         }
        if (!this.editable)
            this.obj.style.visibility="hidden";
   }

   this.getValue = function(){
      return ((this.cell.combo_value==window.undefined)?"":this.cell.combo_value);
   }
   this.getText = function(){
      return this.cell.innerHTML;
   }
	this.getState=function(){
		return {prev:this.cell.__prev,now:this.cell.__now};
    }
   this.detach = function(){
      if(this.val!=this.getValue()){
         this.cell.wasChanged = true;
      }

      if(this.list.parentNode!=null){
         if ((this.obj.value._dhx_trim()!=this.text)||(this._byClick)){
		 	//cell data was changed
			var cval=this.list.value;
			if (!this._byClick)
				this.combo.values[this.combo.keys._dhx_find(cval)]=this.obj.value;
            this.setValue(cval);
         }else{
            this.setValue(this.val);
         }
      }
         if(this.list.parentNode)
            this.list.parentNode.removeChild(this.list);
         if(this.obj.parentNode)
            this.obj.parentNode.removeChild(this.obj);

      return this.val!=this.getValue();
   }
}
eXcell_cor.prototype = new eXcell;
eXcell_cor.prototype.setValue = function(val){
  if ((val||"").toString()._dhx_trim()=="")
     val=null

       	var viVal=this.grid.getCombo(this.cell._cellIndex).get(val);
		if ((val==-1)&&(viVal=="")){
			this.combo.values[this.combo.keys._dhx_find(-1)]="Create new value";
			val=null;
		}


        if (val!==null)
        	this.setCValue( viVal,val);
        else
            this.setCValue("&nbsp;",val);

			this.cell.__prev=this.cell.__now;
			this.cell.__now={key:val,value:viVal};

      this.cell.combo_value = val;
}

/*
Decimal value (10,000.00) eXcell for dhtmlxGrid
(c)DHTMLX LTD. 2005


The corresponding  cell value in XML should be valid number

Samples:
<cell>123.01</cell>
<cell>1234.09356</cell>
<cell>12345</cell>
<cell>0</cell>
<cell>-100</cell>
*/
function eXcell_dec(cell){
	if (cell){
		this.cell = cell;
	    this.grid = this.cell.parentNode.grid;
	}
	this.getValue = function(){
		return parseFloat(this.cell.innerHTML.replace(/,/g,""));
	}

	this.setValue = function(val){
		var format = "0,000.00";
		if(val=="0"){
			this.setCValue(format.replace(/.*(0\.[0]+)/,"$1"),val);
			return;
		}
		var z = format.substr(format.indexOf(".")+1).length
		val = Math.round(val*Math.pow(10,z)).toString();
		var out = "";
		var cnt=0;
		var fl = false;
		for(var i=val.length-1;i>=0;i--){
			cnt++;
			out = val.charAt(i)+out;
			if(!fl && cnt==z){
				out = "."+out;
				cnt=0;
				fl = true;
			}
			if(fl && cnt==3 && i!=0 && val.charAt(i-1)!='-'){
				out = ","+out;
				cnt=0;
			}
		}
		this.setCValue(out,val);
	}
}
eXcell_dec.prototype = new eXcell_ed;

function eXcell_dhxCalendar(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
		
		if (!this.grid._grid_calendarA) {
			
			var cal = this.grid._grid_calendarA = new dhtmlxCalendarObject();
			this.grid.callEvent("onDhxCalendarCreated", [cal]);
			
			var sgrid = this.grid;
			cal.attachEvent("onClick",function(){
                    		this._last_operation_calendar=true;
                    		window.setTimeout(function(){sgrid.editStop()},1);
                    		return true;
                    	});
                    	
                    	var zFunc = function(e){ (e||event).cancelBubble=true; }
                    	dhtmlxEvent(cal.base, "click", zFunc);
                    	cal = null;
                }
	}
}
eXcell_dhxCalendar.prototype = new eXcell;

eXcell_dhxCalendar.prototype.edit = function() {

	var arPos = this.grid.getPosition(this.cell);

	this.grid._grid_calendarA._show(false, false);
	var yPosition = 0;
	if(!window.innerHeight || (arPos[1] + this.grid._grid_calendarA.base.offsetHeight + this.cell.offsetHeight < window.innerHeight)) {
		// Enough space to show dhxCalendar below date
		yPosition = arPos[1]+this.cell.offsetHeight;
	} else {
		// Show dhxCalendar above date
		yPosition = arPos[1]-(this.grid._grid_calendarA.base.offsetHeight);
	}
	var xPosition = arPos[0];
	if (window.innerWidth && (xPosition+this.grid._grid_calendarA.base.clientWidth+ this.cell.offsetWidth>window.innerWidth)) {
		xPosition = window.innerWidth-this.grid._grid_calendarA.base.clientWidth;
	}
	this.grid._grid_calendarA.setPosition(xPosition, yPosition);
	this.grid._grid_calendarA._last_operation_calendar = false;


	this.grid.callEvent("onCalendarShow", [this.grid._grid_calendarA, this.cell.parentNode.idd, this.cell._cellIndex]);
	this.cell._cediton = true;
	this.val = this.cell.val;
	this._val = this.cell.innerHTML;
	var t = this.grid._grid_calendarA.draw;
	this.grid._grid_calendarA.draw = function(){};
	this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d/%m/%Y"));
	this.grid._grid_calendarA.setDate(this.val||(new Date()));
	this.grid._grid_calendarA.draw = t;
}
eXcell_dhxCalendar.prototype.getDate = function() {
	if (this.cell.val) return this.cell.val;
	return null;
}

eXcell_dhxCalendar.prototype.getValue = function() {
	if (this.cell._clearCell) return "";
	if (this.grid._dtmask_inc && this.cell.val) return this.grid._grid_calendarA.getFormatedDate(this.grid._dtmask_inc, this.cell.val).toString();
	return this.cell.innerHTML.toString()._dhx_trim()
}

eXcell_dhxCalendar.prototype.detach = function() {
	if (!this.grid._grid_calendarA) return;
	this.grid._grid_calendarA.hide();
	if (this.cell._cediton) this.cell._cediton = false; else return;
	
	if (this.grid._grid_calendarA._last_operation_calendar) {
		var z1=this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"));
		var z2=this.grid._grid_calendarA.getDate();
		this.cell.val=new Date(z2);
		this.setCValue(z1,z2);
		this.cell._clearCell = !z1;
		var t = this.val;
		this.val = this._val;
		return (this.cell.val.valueOf()!=(t||"").valueOf());
	}
	return false;
}


eXcell_dhxCalendar.prototype.setValue = function(val) {
	
	if (val && typeof val == "object") {
		this.cell.val=val;
		this.cell._clearCell=false;
		this.setCValue(this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString(),this.cell.val);
		return;
	}
	
	
	if (!val || val.toString()._dhx_trim()=="") {
		val="&nbsp";
		this.cell._clearCell=true;
		this.cell.val="";
	} else{
		this.cell._clearCell=false;
		this.cell.val=new Date(this.grid._grid_calendarA.setFormatedDate((this.grid._dtmask_inc||this.grid._dtmask||"%d/%m/%Y"),val.toString(),null,true));
		if (this.grid._dtmask_inc)
			val = this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),this.cell.val);
	}
	
	if ((this.cell.val=="NaN")||(this.cell.val=="Invalid Date")) {
		this.cell._clearCell=true;
		this.cell.val=new Date();
		this.setCValue("&nbsp;",0);
	} else {
		this.setCValue((val||"").toString(),this.cell.val);
	}
}


function eXcell_dhxCalendarA(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
		
		if (!this.grid._grid_calendarA) {
			
			var cal = this.grid._grid_calendarA = new dhtmlxCalendarObject();
			this.grid.callEvent("onDhxCalendarCreated",[cal]);
			
			var sgrid=this.grid;
			cal.attachEvent("onClick",function() {
				this._last_operation_calendar=true;
				window.setTimeout(function() {sgrid.editStop()},1);
				return true;
                    	});
                    	
                    	var zFunc=function(e) { (e||event).cancelBubble=true;  }
                    	dhtmlxEvent(cal.base,"click",zFunc);
                }      
	}
}
eXcell_dhxCalendarA.prototype = new eXcell;

eXcell_dhxCalendarA.prototype.edit = function() {
	var arPos = this.grid.getPosition(this.cell);
	
	this.grid._grid_calendarA._show(false, false);
	this.grid._grid_calendarA.setPosition(arPos[0]*1+this.cell.offsetWidth,arPos[1]*1);
	this.grid.callEvent("onCalendarShow",[this.grid._grid_calendarA,this.cell.parentNode.idd,this.cell._cellIndex]);
	this.grid._grid_calendarA._last_operation_calendar=false;
	
	this.cell._cediton=true;
	this.val=this.cell.val;
	this._val=this.cell.innerHTML;
	
	var t=this.grid._grid_calendarA.draw; this.grid._grid_calendarA.draw=function() {};
	this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d/%m/%Y"));
	this.grid._grid_calendarA.setDate(this.val);
	this.grid._grid_calendarA.draw=t;
	
	this.cell.atag=((!this.grid.multiLine)&&(_isKHTML||_isMacOS||_isFF))?"INPUT":"TEXTAREA";
	
	this.obj = document.createElement(this.cell.atag);
	this.obj.style.height = (this.cell.offsetHeight-4)+"px";
	this.obj.className="dhx_combo_edit";
	this.obj.wrap = "soft";
	this.obj.style.textAlign = this.cell.align;
	this.obj.onclick = function(e) {(e||event).cancelBubble = true}
	this.obj.onmousedown = function(e) {(e||event).cancelBubble = true}
	this.obj.value = this.getValue();
	this.cell.innerHTML = "";
	this.cell.appendChild(this.obj);
	if (window.dhx4.isIE) {
		this.obj.style.overflow = "visible";
		if ((this.grid.multiLine)&&(this.obj.offsetHeight>=18)&&(this.obj.offsetHeight<40)) {
			this.obj.style.height = "36px";
			this.obj.style.overflow = "scroll";
		}
	}
	this.obj.onselectstart=function(e) {
		if (!e) e=event;
		e.cancelBubble = true;
		return true;
	};
	this.obj.focus()
	this.obj.focus()
	
}

eXcell_dhxCalendarA.prototype.getDate = function() {
	if (this.cell.val) return this.cell.val;
	return null;
}

eXcell_dhxCalendarA.prototype.getValue = function() {
	if (this.cell._clearCell) return "";
	if (this.grid._dtmask_inc && this.cell.val)
		return this.grid._grid_calendarA.getFormatedDate(this.grid._dtmask_inc, this.cell.val).toString();
	return this.cell.innerHTML.toString()._dhx_trim()
}

eXcell_dhxCalendarA.prototype.detach = function() {
	if (!this.grid._grid_calendarA) return;
	this.grid._grid_calendarA.hide();
	if (this.cell._cediton) this.cell._cediton=false; else return;
	if (this.grid._grid_calendarA._last_operation_calendar) {
		this.grid._grid_calendarA._last_operation_calendar=false;
		var z1=this.grid._grid_calendarA.getFormatedDate(this.grid._dtmask||"%d/%m/%Y");
		var z2=this.grid._grid_calendarA.getDate();
		this.cell.val=new Date(z2);
		this.setCValue(z1,z2);
		this.cell._clearCell = !z1;
		var t = this.val;
		this.val=this._val;
		return (this.cell.val.valueOf()!=(t||"").valueOf());
	}
	this.setValue(this.obj.value);
	var t = this.val;
	this.val = this._val;
	return (this.cell.val.valueOf()!=(t||"").valueOf());
}

eXcell_dhxCalendarA.prototype.setValue = function(val) {
	if (val && typeof val == "object") {
		this.cell.val=val;
		this.cell._clearCell=false;
		this.setCValue(this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString(),this.cell.val);
		return;
	}
	
	if (!val || val.toString()._dhx_trim()=="") {
		val="&nbsp";
		this.cell._clearCell=true;
		this.cell.val="";
	} else {
		this.cell._clearCell = false;
		this.cell.val = new Date(this.grid._grid_calendarA.setFormatedDate((this.grid._dtmask_inc||this.grid._dtmask||"%d/%m/%Y"),val.toString(),null,true));
		if (this.grid._dtmask_inc)
			val = this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),this.cell.val);
	}
	
	if ((this.cell.val=="NaN")||(this.cell.val=="Invalid Date")) {
		this.cell.val=new Date();
		this.cell._clearCell=true;
		this.setCValue("&nbsp;",0);
	} else {
		this.setCValue((val||"").toString(),this.cell.val);
	}
}

function eXcell_grid(cell){
	if (cell){
		this.cell = cell;
    	this.grid = this.cell.parentNode.grid;
    
    	if (!this.grid._sub_grids) return;
    	this._sub=this.grid._sub_grids[cell._cellIndex];
    	if (!this._sub) return;
    	this._sindex=this._sub[1];
    	this._sub=this._sub[0];
    }
	
	this.getValue = function(){
		return this.cell.val;
	}
	this.setValue = function(val){
		this.cell.val=val;
		
		if (this._sub.getRowById(val)) {
			val=this._sub.cells(val,this._sindex);
		if (val) val=val.getValue();
		else val="";
	 } 
		
		this.setCValue((val||"&nbsp;"),val);
		
	}
	this.edit = function(){ 
		this.val = this.cell.val;
		
		this._sub.entBox.style.display='block';
		var arPos = this.grid.getPosition(this.cell);//,this.grid.objBox
		this._sub.entBox.style.top=arPos[1]+"px";
		this._sub.entBox.style.left=arPos[0]+"px";
		this._sub.entBox.style.position="absolute";
		this._sub.setSizes();
		
		var a=this.grid.editStop;
		this.grid.editStop=function(){};
		if (this._sub.getRowById(this.cell.val)) 
			this._sub.setSelectedRow(this.cell.val);
		this._sub.setActive(true)
		
		this.grid.editStop=a;
	}
	this.detach=function(){
		var old=this.cell.val;
		this._sub.entBox.style.display='none';
		if (this._sub.getSelectedId()===null) return false;
		this.setValue(this._sub.getSelectedId());
		this.grid.setActive(true)
		return this.cell.val!=old;
	}
}
eXcell_grid.prototype = new eXcell;


dhtmlXGridObject.prototype.setSubGrid=function(grid,s_index,t_index){
		if (!this._sub_grids) 
			this._sub_grids=[];
		this._sub_grids[s_index]=[grid,t_index];
		grid.entBox.style.display="none";
		var that=this;

		grid.entBox.onclick = function(event) { (event || window.event).cancelBubble = true;return false; }
		grid.attachEvent("onRowSelect",function(id){
			that.editStop();
			return true;
		});
		grid._chRRS=false;
};

function eXcell_limit(cell){
	
	if (cell){
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function(){
		this.cell.atag=((!this.grid.multiLine)&&(_isKHTML||_isMacOS||_isFF))?"INPUT":"TEXTAREA";
		this.val = this.getValue();
		this.obj = document.createElement(this.cell.atag);
		this.obj.style.height = (this.cell.offsetHeight-(_isIE?6:4))+"px";
        this.obj.className="dhx_combo_edit";
	   	this.obj.wrap = "soft";
		this.obj.style.textAlign = this.cell.align;
		this.obj.onclick = function(e){(e||event).cancelBubble = true}
		this.obj.onmousedown = function(e){(e||event).cancelBubble = true}
		this.obj.value = this.val
		this.cell.innerHTML = "";
		this.cell.appendChild(this.obj);
	  	if (_isFF) {
			this.obj.style.overflow="visible";
			if ((this.grid.multiLine)&&(this.obj.offsetHeight>=18)&&(this.obj.offsetHeight<40)){
				this.obj.style.height="36px";
				this.obj.style.overflow="scroll";
			}
		}
		
		this.obj.onkeypress =function(e){
			if(this.value.length>=15){
			   return false
			}
		}
        this.obj.onselectstart=function(e){  if (!e) e=event; e.cancelBubble=true; return true;  };
		this.obj.focus()
		this.obj.focus()
		
	}
	
	
	this.getValue = function(){
        if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName==this.cell.atag)))
            return this.cell.firstChild.value;
        else
    		return this.cell.innerHTML.toString()._dhx_trim();
	}
	this.setValue = function(val){
		if(val.length > 15)	this.cell.innerHTML = val.substring(0,14)
		else this.cell.innerHTML = val
							
						
	}

	this.detach = function(){
		this.setValue(this.obj.value);
		return this.val!=this.getValue();
	}

}
eXcell_limit.prototype = new eXcell;

/*
HTML Link eXcell v.1.0  for dhtmlxGrid 
(c)DHTMLX LTD. 2005


The corresponding  cell value in XML should be a "^" delimited list of following values:
1st - Link Text 
2nd - URL (optional)
3rd - target (optional, default is _blank)

Samples:
<cell>Stephen King</cell>
<cell>Stephen King^http://www.stephenking.com/</cell>
<cell>Stephen King^http://www.stephenking.com/^_self</cell>
*/

/**
*	@desc: link editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/

function eXcell_link(cell){
	this.cell = cell;
    this.grid = this.cell.parentNode.grid;
    this.isDisabled=function(){return true;}
	this.edit = function(){}
	this.getValue = function(){
		if(this.cell.firstChild.getAttribute){
			var target = this.cell.firstChild.getAttribute("target")
			return this.cell.firstChild.innerHTML+"^"+this.cell.firstChild.getAttribute("href")+(target?("^"+target):"");
		}

		else
			return "";
	}
	this.setValue = function(val){
		if((typeof(val)!="number") && (!val || val.toString()._dhx_trim()=="")){		
			this.setCValue("&nbsp;",valsAr);			
			return (this.cell._clearCell=true);
		}
		var valsAr = val.split("^");
		if(valsAr.length==1)
			valsAr[1] = "";
		else{
			if(valsAr.length>1){
				valsAr[1] = "href='"+valsAr[1]+"'";
				if(valsAr.length==3)
					valsAr[1]+= " target='"+valsAr[2]+"'";
				else
					valsAr[1]+= " target='_blank'";
			}
		}

		this.setCValue("<a "+valsAr[1]+" onclick='(_isIE?event:arguments[0]).cancelBubble = true;'>"+valsAr[0]+"</a>",valsAr);
	}
}

eXcell_link.prototype = new eXcell;
eXcell_link.prototype.getTitle=function(){
	var z=this.cell.firstChild;
	return ((z&&z.tagName)?z.getAttribute("href"):"");
}
eXcell_link.prototype.getContent=function(){
	var z=this.cell.firstChild;
	return ((z&&z.tagName)?z.innerHTML:"");
}

function eXcell_liveedit(cell)
{
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}

	this.edit = function() 
	{
		this.cell.inputObj.focus();
		this.cell.inputObj.focus();
	}

	this.detach = function()
	{
		this.setValue(this.cell.inputObj.value); }

	this.getValue = function()
	{
		return this.cell.inputObj ? this.cell.inputObj.value : '';
	}
	this.destructor = function() {}

	this.onFocus = function()
	{
		var res = this.grid.callEvent('onEditCell', [0, this.cell.parentNode.idd, this.cell._cellIndex]);
		if (res === false)
			this.cell.inputObj.blur();
	}

	this.onBlur = function()
	{
		var res = this.grid.callEvent('onEditCell', [2, this.cell.parentNode.idd, this.cell._cellIndex]);
		this.detach();
	}

	this.onChange = function()
	{
		var res = this.grid.callEvent( "onCellChanged", [this.cell.parentNode.idd, this.cell._cellIndex, this.cell.inputObj.value] );
		this.detach();
	}
}



eXcell_liveedit.prototype = new eXcell_ed;
eXcell_liveedit.prototype.setValue = function(val)
	{
		var self = this;
		this.cell.innerHTML = '<input type="text" value="" style="width:100%;" />';
		
		this.cell.inputObj = this.cell.firstChild;
		this.cell.inputObj = this.cell.firstChild;
//		this.inputObj.style.border = '1px solid ';
		this.cell.inputObj.value = val;
		this.cell.inputObj.onfocus = function() {self.onFocus()}
		
		
		this.cell.inputObj.onblur = function() {self.onFocus()}
		this.cell.inputObj.onchange = function() {self.onChange()}
	}
if (window.eXcell_math){ 
	eXcell_liveedit.prototype.setValueA=eXcell_liveedit.prototype.setValue;
	eXcell_liveedit.prototype.setValue=eXcell_math.prototype._NsetValue;
}

//readonly
function eXcell_mro(cell){
	this.cell = cell;
    this.grid = this.cell.parentNode.grid;
	this.edit = function(){}
}
eXcell_mro.prototype = new eXcell;
eXcell_mro.prototype.getValue = function(){
	return this.cell.childNodes[0].innerHTML._dhx_trim();//innerText;
}
eXcell_mro.prototype.setValue = function(val){
    if (!this.cell.childNodes.length){
        this.cell.style.whiteSpace='normal';
        this.cell.innerHTML="<div style='height:100%; white-space:nowrap; overflow:hidden;'></div>";
        }

	if(!val || val.toString()._dhx_trim()=="")
		val="&nbsp;"
	this.cell.childNodes[0].innerHTML = val;
}

function eXcell_num(cell){
	try{
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}catch(er){}
	this.edit = function(){
		this.val = this.getValue();
		this.obj = document.createElement(_isKHTML?"INPUT":"TEXTAREA");
        this.obj.className="dhx_combo_edit";
		this.obj.style.height = (this.cell.offsetHeight-4)+"px";
		this.obj.wrap = "soft";
		this.obj.style.textAlign = this.cell.align;
		this.obj.onclick = function(e){(e||event).cancelBubble = true}
		this.obj.value = this.val;
		this.cell.innerHTML = "";
		this.cell.appendChild(this.obj);
        this.obj.onselectstart=function(e){  if (!e) e=event; e.cancelBubble=true; return true;  };
		this.obj.focus()
		this.obj.focus()
	}
	this.getValue = function(){
		
        if ((this.cell.firstChild)&&(this.cell.firstChild.tagName=="TEXTAREA"))
            return this.cell.firstChild.value;
        else
		return this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(),this.cell._cellIndex);
	}
	 this.setValue = function(val){
		var re = new RegExp("[a-z]|[A-Z]","i")
		if(val.match(re)) val = "&nbsp;";
				
		this.cell.innerHTML = val;
		
	}

	this.detach = function(){
        var tv=this.obj.value;
		this.setValue(tv);
		return this.val!=this.getValue();
	}
}
eXcell_num.prototype = new eXcell;

function eXcell_passw(cell){
	
	if (cell){
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	
	this.edit = function(){
		this.cell.innerHTML = "";
		this.cell.atag="INPUT";
		this.val = this.getValue();
		this.obj = document.createElement(this.cell.atag);
		this.obj.style.height = (this.cell.offsetHeight-(_isIE?6:4))+"px";
        this.obj.className="dhx_combo_edit";
		this.obj.type = "password";
	   	this.obj.wrap = "soft";
		this.obj.style.textAlign = this.cell.align;
		this.obj.onclick = function(e){(e||event).cancelBubble = true}
		this.obj.onmousedown = function(e){(e||event).cancelBubble = true}
		this.obj.value = this.cell._rval||"";
		this.cell.appendChild(this.obj);
	  	if (_isFF) {
			this.obj.style.overflow="visible";
			if ((this.grid.multiLine)&&(this.obj.offsetHeight>=18)&&(this.obj.offsetHeight<40)){
				this.obj.style.height="36px";
				this.obj.style.overflow="scroll";
			}
		}
        this.obj.onselectstart=function(e){  if (!e) e=event; e.cancelBubble=true; return true;  };
		this.obj.focus()
		this.obj.focus()
					
					
					
	}
	this.getValue = function(){
        return this.cell._rval;
	}
	this.setValue = function(val){
		var str = "*****";
		this.cell.innerHTML  = str;
		this.cell._rval=val;
					
						
	}

	this.detach = function(){
		this.setValue(this.obj.value);
		return this.val!=this.getValue();
	}

}
eXcell_passw.prototype = new eXcell;

/**
*   @desc: radio editor
*   @returns: dhtmlxGrid cell editor object
*   @type: public
*/
function eXcell_ra_str(cell){
   if (cell){
   this.base = eXcell_ra;
   this.base(cell)
   this.grid = cell.parentNode.grid;
	}
}
eXcell_ra_str.prototype = new eXcell_ch;
eXcell_ra_str.prototype.setValue = function(val){
  this.cell.style.verticalAlign = "middle";//nb:to center checkbox in line
  if (val){
           val=val.toString()._dhx_trim();
     if ((val=="false")||(val=="0")) val="";
     }
  if(val){
		if (this.grid.rowsAr[this.cell.parentNode.idd])
		         for (var i=0;i<this.grid._cCount;i++) {
		if (i!==this.cell._cellIndex) {
		                var cell = this.grid.cells(this.cell.parentNode.idd,i);
		                if ((cell.cell._cellType||this.grid.cellType[cell.cell._cellIndex])!="ra_str") continue;
		                if (cell.getValue())
		                   cell.setValue("0");
		}
     }
     val = "1";
     this.cell.chstate = "1";
  }else{
     val = "0";
     this.cell.chstate = "0"
  }
  this.setCValue("<img src='"+this.grid.imgURL+"radio_chk"+val+".gif' onclick='new eXcell_ra_str(this.parentNode).changeState()'>",this.cell.chstate);
   }

function eXcell_sub_row(cell){
	if (cell){
		this.cell = cell;
    	this.grid = this.cell.parentNode.grid;
	}
	
	this.getValue = function(){
		return this.grid.getUserData(this.cell.parentNode.idd,"__sub_row");
	}
	this._setState = function(m,v){
		(v||this.cell).innerHTML="<img src='"+this.grid.imgURL+m+"' width='18' height='18' />";
		(v||this.cell).firstChild.onclick=this.grid._expandMonolite;
	}
	this.open = function (){
		this.cell.firstChild.onclick(null,true)
	}
	this.close = function (){
		this.cell.firstChild.onclick(null,false,true)
	}
	this.isOpen = function(){
		return !!this.cell.parentNode._expanded;
	}
	this.setValue = function(val){
		if (val)
			this.grid.setUserData(this.cell.parentNode.idd,"__sub_row",val);
		this._setState(val?"plus.gif":"blank.gif");
	}
	this.setContent = function(val){
		if (this.cell.parentNode._expanded){
			this.cell.parentNode._expanded.innerHTML=val;
			this.resize();
		}
		else{
			this.cell._previous_content=null;
			this.setValue(val);
			this.cell._sub_row_type=null
		}
			
	}
	this.resize = function(){
		this.grid._detectHeight(this.cell.parentNode._expanded,this.cell,this.cell.parentNode._expanded.scrollHeight);
	},
	this.isDisabled = function(){ return true; }
	this.getTitle = function(){ return this.grid.getUserData(this.cell.parentNode.idd,"__sub_row")?"click to expand|collapse":""; }
}
eXcell_sub_row.prototype = new eXcell;

function eXcell_sub_row_ajax(cell){
	this.base=eXcell_sub_row;
	this.base(cell);
	
	this.setValue = function(val){
		if (val)
			this.grid.setUserData(this.cell.parentNode.idd,"__sub_row",val);
			this.cell._sub_row_type="ajax";
			this.cell._previous_content = null;
		this._setState(val?"plus.gif":"blank.gif");
	}
}
eXcell_sub_row_ajax.prototype = new eXcell_sub_row;

function eXcell_sub_row_grid(cell){
	this.base=eXcell_sub_row;
	this.base(cell);
	
	this.setValue = function(val){
		if (val)
			this.grid.setUserData(this.cell.parentNode.idd,"__sub_row",val);
			this.cell._sub_row_type="grid";
		this._setState(val?"plus.gif":"blank.gif");
	}
	this.getSubGrid = function(){
		if (!cell._sub_grid) return null;
		return cell._sub_grid;
	}
}
eXcell_sub_row_grid.prototype = new eXcell_sub_row;

dhtmlXGridObject.prototype._expandMonolite=function(n,show,hide){
	var td=this.parentNode;
	var row=td.parentNode;
	var that=row.grid;
	
	if (n||window.event){
		if (!hide && !row._expanded) that.editStop();
		(n||event).cancelBubble=true;
	}
	
	var c=that.getUserData(row.idd,"__sub_row");
	
	if (!that._sub_row_editor)
    	that._sub_row_editor=new eXcell_sub_row(td);
	
	if (!c) return;
	
	if (row._expanded && !show){
		that._sub_row_editor._setState("plus.gif",td);
		td._previous_content=row._expanded;
		that.objBox.removeChild(row._expanded);
		row._expanded=false;
		row.style.height=(row.oldHeight||20)+"px";
		td.style.height=(row.oldHeight||20)+"px";	
		
		if (that._fake){
			that._fake.rowsAr[row.idd].style.height=(row.oldHeight||20)+"px";
			that._fake.rowsAr[row.idd].firstChild.style.height=(row.oldHeight||20)+"px";
		}
			
		for (var i=0; i<row.cells.length; i++)
			row.cells[i].style.verticalAlign="middle";
			
		delete that._flow[row.idd];
		that._correctMonolite();
		row._expanded.ctrl=null;
	}else if (!row._expanded && !hide){
		that._sub_row_editor._setState("minus.gif",td);
		row.oldHeight=td.offsetHeight-4;
		if (td._previous_content){
			var d=td._previous_content;
			d.ctrl=td;
			that.objBox.appendChild(d);
			that._detectHeight(d,td,parseInt(d.style.height))	
		}
		else {
			var d=document.createElement("DIV");
			d.ctrl=td;
			if (td._sub_row_type)
				that._sub_row_render[td._sub_row_type](that,d,td,c);
			else
				d.innerHTML=c;
			d.style.cssText="position:absolute; left:0px; top:0px; overflow:auto; font-family:Tahoma; font-size:8pt; margin-top:2px; margin-left:4px;";
			d.className="dhx_sub_row";
			that.objBox.appendChild(d);
			that._detectHeight(d,td)			
		}
		

			
		
		if (!that._flow) {
			that.attachEvent("onGridReconstructed",function(){ 
				if ((this.pagingOn && !this.parentGrid) || this._srnd) this._collapsMonolite();
				else this._correctMonolite(); 
			});
			that.attachEvent("onResizeEnd",function(){ this._correctMonolite(true); });
			that.attachEvent("onAfterCMove",function(){ this._correctMonolite(true); });
			that.attachEvent("onDrop",function(){ this._correctMonolite(true); });
			that.attachEvent("onBeforePageChanged",function(){ this._collapsMonolite(); return true; });
			that.attachEvent("onGroupStateChanged",function(){ this._correctMonolite(); return true; });
			that.attachEvent("onFilterEnd",function(){ this._collapsMonolite(); });
			that.attachEvent("onUnGroup",function(){ this._collapsMonolite(); });
			that.attachEvent("onPageChanged",function(){ this._collapsMonolite(); });
			
			that.attachEvent("onXLE",function(){ this._collapsMonolite(); });
			that.attachEvent("onClearAll",function(){ for (var i in this._flow) {
				if (this._flow[i] && this._flow[i].parentNode) this._flow[i].parentNode.removeChild(this._flow[i]);
			}; this._flow=[]; });
			that.attachEvent("onEditCell",function(a,b,c){  if ((a!==2) && this._flow[b] && this.cellType[c]!="ch" && this.cellType[c]!="ra") this._expandMonolite.apply(this._flow[b].ctrl.firstChild,[0,false,true]);  return true; });
			that.attachEvent("onCellChanged",function(id,ind){ if (!this._flow[id]) return; 
				var c=this.cells(id,ind).cell;
				c.style.verticalAlign="top";
			});
			
			that._flow=[];
		}
		that._flow[row.idd]=d;
		that._correctMonolite();
		//d.style.top=row.offsetTop+20+"px";
		
		var padtop = that._srdh > 30 ? 11:3;
		if (that.multiLine) padtop = 0;

		for (var i=0; i<row.cells.length; i++)
			row.cells[i].style.verticalAlign="top";
		if (that._fake){
			var frow=that._fake.rowsAr[row.idd];
			for (var i=0; i<frow.cells.length; i++){
				frow.cells[i].style.verticalAlign="top";
			}
		}
		row._expanded=d;
	}
	if (that._ahgr)
		that.setSizes()
	if (that.parentGrid)
		that.callEvent("onGridReconstructed",[]);
	that.callEvent("onSubRowOpen",[row.idd,(!!row._expanded)]);
}
dhtmlXGridObject.prototype._sub_row_render={
    "ajax":function(that,d,td,c){
        d.innerHTML="Loading...";
        //d.innerHTML=that.i18n.loading;
        dhx4.ajax.get(c, function(xml){
            d.innerHTML=xml.xmlDoc.responseText;
            var z=xml.xmlDoc.responseText.match(/<script[^>]*>([^\f]+?)<\/script>/g);
            if (z)
                for (var i=0; i<z.length; i++)
                    eval(z[i].replace(/<([\/]{0,1})s[^>]*>/g,""));

			that._detectHeight(d,td)
			that._correctMonolite();
			that.setUserData(td.parentNode.idd,"__sub_row",xml.xmlDoc.responseText);
			td._sub_row_type=null;
			if (that._ahgr)
				that.setSizes()
			that.callEvent("onSubAjaxLoad",[td.parentNode.idd,xml.xmlDoc.responseText]);
		});
	},
	"grid":function(that,d,td,c){
		   td._sub_grid= new dhtmlXGridObject(d);
		   if (that.skin_name)
				td._sub_grid.setSkin(that.skin_name);
				
		   td._sub_grid.parentGrid=that;
		   td._sub_grid.imgURL = that.imgURL;
		   td._sub_grid.iconURL = that.iconURL;
		   td._sub_grid.enableAutoHeight(true);
		   td._sub_grid._delta_x = td._sub_grid._delta_y = null;
		   td._sub_grid.attachEvent("onGridReconstructed",function(){
		   		that._detectHeight(d,td,td._sub_grid.objBox.scrollHeight+td._sub_grid.hdr.offsetHeight+(this.ftr?this.ftr.offsetHeight:0));
		   		that._correctMonolite();
		   		this.setSizes();
		   		if (that.parentGrid) that.callEvent("onGridReconstructed",[]);
	   	   })
		   if (!that.callEvent("onSubGridCreated",[td._sub_grid,td.parentNode.idd,td._cellIndex,c])){
		   		td._sub_grid.objBox.style.overflow="hidden";
				td._sub_row_type=null;
		   } else {
			   td._sub_grid.load(c,function(){
					that._detectHeight(d,td,td._sub_grid.objBox.scrollHeight+td._sub_grid.hdr.offsetHeight+(td._sub_grid.ftr?td._sub_grid.ftr.offsetHeight:0));
					td._sub_grid.objBox.style.overflow="hidden";
					that._correctMonolite();
					td._sub_row_type=null;
					if (!that.callEvent("onSubGridLoaded",[td._sub_grid,td.parentNode.idd,td._cellIndex,c])) return;
					if (that._ahgr) that.setSizes();
					if (that.parentGrid) that.callEvent("onGridReconstructed",[]);
			  	});		   
			}
	}
}

dhtmlXGridObject.prototype._detectHeight=function(d,td,h){
	var l=td.offsetLeft+td.offsetWidth;
		d.style.left=l+"px";
		d.style.width=Math.max(0,td.parentNode.offsetWidth-l-4)+"px"
		var h=h||d.scrollHeight;
		d.style.overflow="hidden";
		d.style.height=h+"px";		
		var row=td.parentNode;
		td.parentNode.style.height=(row.oldHeight||20)+h*1+"px";	
		td.style.height=(row.oldHeight||20)+h*1+"px";	
		if (this._fake){
			var tr=this._fake.rowsAr[td.parentNode.idd];
			tr.style.height=(row.oldHeight||20)+h*1+"px";	
			tr.firstChild.style.height=(row.oldHeight||20)+h*1+"px";	
		}
}
dhtmlXGridObject.prototype._correctMonolite=function(mode){
	if (this._in_correction) return;
	this._in_correction=true;
	
	for (var a in this._flow)
		if (this._flow[a] && this._flow[a].tagName=="DIV")
			if (this.rowsAr[a]){			
				if (this.rowsAr[a].style.display=="none") {
					this.cells4(this._flow[a].ctrl).close();
					continue;
				}
				this._flow[a].style.top=this.rowsAr[a].offsetTop+(this.rowsAr[a].oldHeight||20)+"px";
				if (mode) {
					var l=this._flow[a].ctrl.offsetLeft+this._flow[a].ctrl.offsetWidth;
					this._flow[a].style.left=l+"px";
					this._flow[a].style.width=this.rowsAr[a].offsetWidth-l-4+"px"
				}
			}
			else{
				this._flow[a].ctrl=null;
				this.objBox.removeChild(this._flow[a]);
				delete this._flow[a];
			}

	this._in_correction=false;
}
dhtmlXGridObject.prototype._collapsMonolite=function(){
		for (var a in this._flow)
			if (this._flow[a] && this._flow[a].tagName=="DIV")
				if (this.rowsAr[a])
					this.cells4(this._flow[a].ctrl).close();
}

function eXcell_time(cell){

	this.base = eXcell_ed;
	this.base(cell)
	this.getValue = function(){
			return this.cell.innerHTML.toString();
	}
	this.setValue = function(val){
	var re = new RegExp(" ","i")
	val = val.replace(re,":")
	if((val=="")) val = "00:00"
	else
	{
		var re = new RegExp("[a-zA-Z]","i")
		var res = val.match(re)
		
		if(res) val = "00:00";
		else{
			var re = new RegExp("[0-9]+[\\.\\/;\\-,_\\]\\[\\?\\: ][0-9]+","i")
			var res = val.search(re)
			if(res!=-1){
				var re = new RegExp("[\\./\\;\\-\\,\\_\\]\\[ \\?]","i")
				val = val.replace(re,":")
			}
			else
			{
				var re = new RegExp("[^0-9]","i")
				res1 = val.search(re)
				if(res = val.match(re) ) { val = "00:00";}
				else
				{
				if(val.length == 1)
				{
					val = "00:0"+val;
				}
				else
				{
					if(parseInt(val) < 60) val = "00:"+val;
					else
					if(val.length < 5)
					{
						var minutes = parseInt(val);
						var hours =  Math.floor(minutes/60);
						minutes = minutes - 60*hours;
						var hours = hours.toString();
						var minutes = minutes.toString();
						while(hours.length < 2){
							hours = "0" + hours;
						}
						while(minutes.length < 2){
							minutes = "0" + minutes;
						}
						val = hours+":"+minutes;
					}
				}
				}
					
			}
		}
	}
	this.cell.innerHTML = val;
	}

	
}
eXcell_time.prototype = new eXcell_ed;

function eXcell_stree(cell){
	if (cell){
		this.cell = cell;
    	this.grid = this.cell.parentNode.grid;
    
    	if (!this.grid._sub_trees) return;
    	this._sub=this.grid._sub_trees[cell._cellIndex];
    	if (!this._sub) return;
    	this._sub=this._sub[0];
    }
	
	this.getValue = function(){
		return this.cell._val;
	}
	this.setValue = function(val){
		this.cell._val=val;
		val = this._sub.getItemText(this.cell._val);
		this.setCValue((val||"&nbsp;"),val);
	}
	this.edit = function(){
		this._sub.parentObject.style.display='block';
		var arPos = this.grid.getPosition(this.cell);//,this.grid.objBox
		this._sub.parentObject.style.top=arPos[1]+"px";
		this._sub.parentObject.style.left=arPos[0]+"px";
		this._sub.parentObject.style.position="absolute";
		
		var a=this.grid.editStop;
		this.grid.editStop=function(){};
		
		this.grid.editStop=a;
	}
	this.detach=function(){
		this._sub.parentObject.style.display='none';
		if (this.grid._sub_id != null) {
			var old=this.cell._val;
			this.setValue(this._sub.getSelectedItemId());
			this.grid._sub_id = null;
			return this.cell._val!=old;
		}
	}
}
eXcell_stree.prototype = new eXcell;


dhtmlXGridObject.prototype.setSubTree=function(tree,s_index){
		if (!this._sub_trees) 
			this._sub_trees=[];
		this._sub_trees[s_index]=[tree];
		tree.parentObject.style.display="none";
		var that=this;
		tree.parentObject.onclick = function(event) {(event || window.event).cancelBubble = true;return false;}
		tree.ev_onDblClick=null;
		tree.attachEvent("onDblClick",function(id){
			that._sub_id = id;
			that.editStop();
			return true;
		});
		tree._chRRS=true;
};

/*
Textfield with Button eXcell v.1.0  for dhtmlxGrid
(c)DHTMLX LTD. 2005


The corresponding  cell value in XML should be

Samples:

<cell>IN637237-23</cell>
<cell>158</cell>
*/


function eXcell_wbut(cell){
	this.cell = cell;
    this.grid = this.cell.parentNode.grid;
	this.edit = function(){
		var val = this.getValue().toString();
		this.obj = document.createElement("INPUT");
			this.obj.readOnly = true;
			this.obj.style.width = "60px";
			this.obj.style.height = (this.cell.offsetHeight-(this.grid.multiLine?5:4))+"px";
			this.obj.style.border = "0px";
			this.obj.style.margin = "0px";
			this.obj.style.padding = "0px";
			this.obj.style.overflow = "hidden";
			this.obj.style.fontSize = _isKHTML?"10px":"12px";
			this.obj.style.fontFamily = "Arial";
			this.obj.wrap = "soft";
			this.obj.style.textAlign = this.cell.align;
			this.obj.onclick = function(e){(e||event).cancelBubble = true}
			this.cell.innerHTML = "";
			this.cell.appendChild(this.obj);
			this.obj.onselectstart=function(e){  if (!e) e=event; e.cancelBubble=true; return true;  };
			this.obj.style.textAlign = this.cell.align;
			this.obj.value=val;
			this.obj.focus()
			this.obj.focus()
		this.cell.appendChild(document.createTextNode(" ")); // Create space between text box and button
		var	butElem = document.createElement('input');        // This is the button DOM code
			if(_isIE){
				butElem.style.height = (this.cell.offsetHeight-(this.grid.multiLine?5:4))+"px";
				butElem.style.lineHeight = "5px";
			}else{
				butElem.style.fontSize = "8px";
				butElem.style.width = "10px";
				butElem.style.marginTop = "-5px"
			}

			butElem.type='button'
			butElem.name='Lookup'
			butElem.value='...'
			var inObj = this.obj;
			var inCellIndex = this.cell.cellIndex
			var inRowId = this.cell.parentNode.idd
			var inGrid = this.grid
			var inCell = this;
			this.dhx_m_func=this.grid.getWButFunction(this.cell._cellIndex);
            butElem.onclick = function (e){inCell.dhx_m_func(inCell,inCell.cell.parentNode.idd,inCell.cell._cellIndex,val)};
		this.cell.appendChild(butElem);
	}
	this.detach = function(){
					this.setValue(this.obj.value);
					return this.val!=this.getValue();
  }
}
eXcell_wbut.prototype = new eXcell;

dhtmlXGridObject.prototype.getWButFunction=function(index){
	if (this._wbtfna) return this._wbtfna[index];
	else return (function(){});
}
dhtmlXGridObject.prototype.setWButFunction=function(index,func){
	if (!this._wbtfna) this._wbtfna=new Array();
	this._wbtfna[index]=func;
}