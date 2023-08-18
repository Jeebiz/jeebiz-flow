jQuery(function($) {

	$.post(_path + "/func/nav/treeMenuList", {
		name : "John",
		time : "2pm"
	}, function(data) {
		
		if($.founded(data)){
			
			var html = [];
			
			$.each(data || [], function(id, top){
				
				if(top["sfgnym"] == '1'){
					html.push('<!--Top menu-->');
					html.push('<li class="active-link">');
						html.push('<a href="' + top["dyym"] + '">');
							html.push('<i class="demo-psi-home"></i><span class="menu-title"> <strong>' + top["gnmkmc"] + '</strong> </span>');
						html.push('</a>');
					html.push('</li>');
				} else {
	                    
					html.push('<!--Category name-->');
					html.push('<li class="list-header">' + top["gnmkmc"] + '</li>');
					//存在二级菜单
					if($.founded(top["children"])){
						// 二级菜单
						$.each(top["children"] || [], function(id, item){
							
							html.push('<!--Menu list item-->');
							html.push('<li>');
								
							if(item["sfgnym"] == '1'){
								html.push('<a href="' + item["dyym"] + '">');
									html.push('<i class="ti-rss"></i><span class="menu-title">' + item["gnmkmc"] + '</span>');
								html.push('</a>');
							} else {
							
								html.push('<a href="#">');
									html.push('<i class="ti-rss"></i><span class="menu-title">' + item["gnmkmc"] + '</span><i class="arrow"></i>');
								html.push('</a>');
								
								//存在三级菜单
								if($.founded(item["children"])){
									html.push('<!--Submenu-->');
									html.push('<ul class="collapse">');
									// 三级菜单
									$.each(item["children"] || [], function(id, menu){
										html.push('<li><a href="' + menu["dyym"] + '">' + menu["gnmkmc"] + '</a></li>');
									});
									html.push('</ul>');
								}
								
							}
							html.push('</li>');
						});
						
					}
					
				}
				
			});
			
			try {
				$("#mainnav-menu").empty().html(html.join(""));
				$('#mainnav-menu').metisMenu({ toggle: true });
	        }catch(err) {
	            console.error(err.message);
	        }
	        //class="active"
		}
		/*
		$('#tab-general>.tab-content>.tab-pane').mCustomScrollbar({
			theme: "inset-dark"
		});

		$('#tabs').tabs({
			monitor: '.zf-nav-item-list,.zf-lately-use-block,.zf-left-nav-panel',
			contextmenu:false
		});*/
		
		
	});

})