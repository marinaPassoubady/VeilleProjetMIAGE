function openPage(pageName) {
	console.log('nom : ' + pageName);
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  document.getElementById(pageName).style.display = "block";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click(); 


function createOnglet(id) {
	// creation du bouton
	console.log('je suis rentre dans createOnglet');
    var onglet = document.createElement('button');
    var btnDiag = document.createElement('button');
    var navBar = document.getElementById('nav');
    var divPrinci = document.getElementById(id);

    onglet.innerHTML = "Onglet 1";
    onglet.setAttribute('class','tablink');
    onglet.setAttribute('onClick',"openPage('"+id+"')");
    navBar.appendChild(onglet);

    btnDiag.innerHTML = "Ajouter un onglet";
    btnDiag.setAttribute('onClick',"createOnglet('second')");
    divPrinci.appendChild(btnDiag);

    main(id);
}


		function main(idName)
		{
			// Defines an icon for creating new connections in the connection handler.
			// This will automatically disable the highlighting of the source vertex.
			mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);
		
			// Checks if browser is supported
			if (!mxClient.isBrowserSupported())
			{
				// Displays an error message if the browser is
				// not supported.
				mxUtils.error('Browser is not supported!', 200, false);
			}
			else
			{
				// Creates the div for the toolbar
                var divPrincipale = document.getElementById(idName);
				var tbContainer = document.createElement('div');
                //tbContainer.id = idName;
				tbContainer.style.position = 'absolute';
				tbContainer.style.overflow = 'hidden';
				tbContainer.style.padding = '2px 2px 400px 2px';
				tbContainer.style.width = '240px';
				tbContainer.style.left = '500px';
				tbContainer.style.display = 'inline-block';
				
				divPrincipale.appendChild(tbContainer);
			
				// Creates new toolbar without event processing
				var toolbar = new mxToolbar(tbContainer);
				toolbar.enabled = false
				
				// Creates the div for the graph
				container = document.createElement('div');
				//container.style.position = 'absolute';
				container.style.overflow = 'hidden';
				container.style.left = '24px';
				container.style.top = '60px';
				container.style.right = '0px';
				container.style.bottom = '0px';
				container.style.background = 'url("editors/images/grid.gif")';
				container.style.display = 'inline-block';
				container.style.width = '1150px';

				divPrincipale.appendChild(container);
				

				var deleteImage = new mxImage('editors/images/overlays/forbidden.png', 16, 16);

				// Permet de supprimer un Item
				// Overridden to add an additional control to the state at creation time
				mxCellRendererCreateControl = mxCellRenderer.prototype.createControl;
				mxCellRenderer.prototype.createControl = function(state)
				{
					mxCellRendererCreateControl.apply(this, arguments);
					
					var graph = state.view.graph;
					
					if (graph.getModel().isVertex(state.cell))
					{
						if (state.deleteControl == null)
						{
							var b = new mxRectangle(0, 0, deleteImage.width, deleteImage.height);
							state.deleteControl = new mxImageShape(b, deleteImage.src);
							state.deleteControl.dialect = graph.dialect;
							state.deleteControl.preserveImageAspect = false;
							
							this.initControl(state, state.deleteControl, false, function (evt)
							{
								if (graph.isEnabled())
								{
									graph.removeCells([state.cell]);
									mxEvent.consume(evt);
								}
							});
						}
					}
					else if (state.deleteControl != null)
					{
						state.deleteControl.destroy();
						state.deleteControl = null;
					}
				};
				
				// Helper function to compute the bounds of the control
				var getDeleteControlBounds = function(state)
				{
					if (state.deleteControl != null)
					{
						var oldScale = state.deleteControl.scale;
						var w = state.deleteControl.bounds.width / oldScale;
						var h = state.deleteControl.bounds.height / oldScale;
						var s = state.view.scale;			

						return (state.view.graph.getModel().isEdge(state.cell)) ? 
							new mxRectangle(state.x + state.width / 2 - w / 2 * s,
								state.y + state.height / 2 - h / 2 * s, w * s, h * s)
							: new mxRectangle(state.x + state.width - w * s,
								state.y, w * s, h * s);
					}
					
					return null;
				};
				
				// Overridden to update the scale and bounds of the control
				mxCellRendererRedrawControl = mxCellRenderer.prototype.redrawControl;
				mxCellRenderer.prototype.redrawControl = function(state)
				{
					mxCellRendererRedrawControl.apply(this, arguments);
					
					if (state.deleteControl != null)
					{
						var bounds = getDeleteControlBounds(state);
						var s = state.view.scale;
						
						if (state.deleteControl.scale != s || !state.deleteControl.bounds.equals(bounds))
						{
							state.deleteControl.bounds = bounds;
							state.deleteControl.scale = s;
							state.deleteControl.redraw();
						}
					}
				};
				
				// Overridden to remove the control if the state is destroyed
				mxCellRendererDestroy = mxCellRenderer.prototype.destroy;
				mxCellRenderer.prototype.destroy = function(state)
				{
					mxCellRendererDestroy.apply(this, arguments);

					if (state.deleteControl != null)
					{
						state.deleteControl.destroy();
						state.deleteControl = null;
					}
				};
				
				// Workaround for Internet Explorer ignoring certain styles
				if (mxClient.IS_QUIRKS)
				{
					document.body.style.overflow = 'hidden';
					new mxDivResizer(tbContainer);
					new mxDivResizer(container);
				}
	
				// Creates the model and the graph inside the container
				// using the fastest rendering available on the browser
				var model = new mxGraphModel();
				var graph = new mxGraph(container, model);
				graph.dropEnabled = true;
				
				// Matches DnD inside the graph
				mxDragSource.prototype.getDropTarget = function(graph, x, y)
				{
					var cell = graph.getCellAt(x, y);
					
					if (!graph.isValidDropTarget(cell))
					{
						cell = null;
					}
					
					return cell;
				};

				// Enables new connections in the graph
				graph.setConnectable(true);
				graph.setMultigraph(false);

				// Stops editing on enter or escape keypress
				var keyHandler = new mxKeyHandler(graph);
				var rubberband = new mxRubberband(graph);
				
				var addVertex = function(icon, w, h, style)
				{
					var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
					vertex.setVertex(true);
				
					addToolbarItem(graph, toolbar, vertex, icon);
				};
				
				addVertex('editors/images/swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;');
				addVertex('editors/images/rectangle.gif', 100, 40, '');
				addVertex('editors/images/rounded.gif', 100, 40, 'shape=rounded');
				addVertex('editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
				addVertex('editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
				addVertex('editors/images/triangle.gif', 40, 40, 'shape=triangle');
				addVertex('editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
				addVertex('editors/images/actor.gif', 30, 40, 'shape=actor');
				addVertex('editors/images/hexagon.gif', 30, 40, 'shape=hexagon');
				toolbar.addLine();
				
				var button = mxUtils.button('Create toolbar entry from selection', function(evt)
				{
					if (!graph.isSelectionEmpty())
					{
						// Creates a copy of the selection array to preserve its state
						var cells = graph.getSelectionCells();
						var bounds = graph.getView().getBounds(cells);
						
						// Function that is executed when the image is dropped on
						// the graph. The cell argument points to the cell under
						// the mousepointer if there is one.
						var funct = function(graph, evt, cell)
						{
							graph.stopEditing(false);
			
							var pt = graph.getPointForEvent(evt);
							var dx = pt.x - bounds.x;
							var dy = pt.y - bounds.y;
							
							graph.setSelectionCells(graph.importCells(cells, dx, dy, cell));
						}
			
						// Creates the image which is used as the drag icon (preview)
						var img = toolbar.addMode(null, 'editors/images/outline.gif', funct);
						mxUtils.makeDraggable(img, graph, funct);
					}
				});

				button.style.position = 'static';
				button.style.left = '2px';
				button.style.top = '2px';
				
				divPrincipale.appendChild(button);
			}
		}

		function addToolbarItem(graph, toolbar, prototype, image)
		{
			// Function that is executed when the image is dropped on
			// the graph. The cell argument points to the cell under
			// the mousepointer if there is one.
			var funct = function(graph, evt, cell)
			{
				graph.stopEditing(false);

				var pt = graph.getPointForEvent(evt);
				var vertex = graph.getModel().cloneCell(prototype);
				vertex.geometry.x = pt.x;
				vertex.geometry.y = pt.y;
				
				graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
			}

			// Creates the image which is used as the drag icon (preview)
			var img = toolbar.addMode(null, image, funct);
			mxUtils.makeDraggable(img, graph, funct);
		}

