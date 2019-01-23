if(jQuery)( function() {
	$.extend($.fn, {
		contextMenu: function(o) {
			// Par défaut
			if( o.menu == undefined ) return false;
			// boucle sur chaque element du menu
			$(this).each( function() {
				// Ajoute la classe contextMenu
				$('#' + o.menu).addClass('contextMenu');
				// Simule le clic droit
				$(this).mousedown( function(e) {
					var evt = e;
					$(this).mouseup( function(e) {
						$(this).unbind('mouseup');
						if( evt.button == 2 ) {
							// affiche le menu
							$(document).unbind('click');					
						}
					});
				});
			});
			return $(this);
		},		
	});
})(jQuery);