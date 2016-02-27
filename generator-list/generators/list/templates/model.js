(function (parent){
    var dataProvider = app.data.<%= dataProvider %>,<% if ((typeof imageField !== 'undefined' && imageField) || (typeof detailImageField !== 'undefined' && detailImageField)) { %>
        processImage = function(img) {
            if (!img) {
                var empty1x1png= 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            }<% if (source === 'everlive') { %> else if (img.slice(0, 4) !== 'http' &&
                    img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
                var setup = dataProvider.setup || {};
                img = setup.scheme + ':' + setup.url + setup.<%= _isApp ? 'appId' : 'apiKey' %> + '/Files/' + img + '/Download';
            }<% } %>

            return img;
        }, <% } %> <% if (source === 'everlive') { %>
        flattenLocationProperties = function (dataItem) {
            var propName, propValue,
                isLocation = function (value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },<% } %><% if (source === 'jsdo') { %>
        jsdoOptions = {
            name: '<%= collection %>',
            autoFill : false
        },<% } %>
        dataSourceOptions = {
        type: '<%= source %>',
        transport: {<% if (source === 'everlive' || source === 'sitefinity') { %>
            typeName: '<%= collection %>',
            dataProvider: dataProvider<% } else if (source !== 'jsdo') { %>
            read: {
                url: dataProvider.url
            }<% } %>
        },<% if ((typeof group !== 'undefined' && group) && !endlessScroll) { %>
        group: { field: '<%= group %>' },<% } %>
        <% if ((typeof imageField !== 'undefined' && imageField) || source === 'everlive') { %>
        change: function(e){
            var data = this.data();
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                <% if (typeof imageField !== 'undefined' && imageField) { %>
                dataItem['<%= imageField %>Url'] =
                    processImage(dataItem['<%= imageField %>']);
                <% } %><% if (source === 'everlive') { %>
                flattenLocationProperties(dataItem);<% } %>
            }
        },<% } %>
        schema: {<% if (source === 'json') { %>
            data: '<%= collection %>',<% } %>
            model: {
                fields: {<% var usedFields = {};
                    for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (f && !usedFields[f]) { %>
                    '<%= f %>': {
                        field: '<%= f %>',
                        defaultValue: ''
                    }, <% }
                    usedFields[f] = true;
                    } %>
                }<% if (typeof iconField !== 'undefined' && iconField) { %>
                    ,icon: function() {
                      var i = 'globe';
                      return kendo.format('km-icon km-{0}', i);
                    }<% } %>
            }
        },<% if (typeof endlessScroll !== 'undefined' && endlessScroll) { %><% if (typeof filterField !== 'undefined' && filterField) { %>
        serverFiltering: true,<% } %>
        serverSorting: true,
        serverPaging: true,
            pageSize: 50<% } %>
        },
        dataSource = new kendo.data.DataSource(<% if (source !== 'jsdo') { %>dataSourceOptions<% } else { %>{ pageSize: 50 }<% } %>),
        <%= name %> = kendo.observable({
            dataSource: dataSource<% if (source === 'jsdo') { %>,
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions<% } %><% if (typeof masterDetails !== 'undefined' && masterDetails) { %>,
            itemClick: function (e) {
                app.mobileApp.navigate('#components/<%= parent %>/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = <%= name %>.get('dataSource'),
                    itemModel = dataSource.getByUid(item);<% if (typeof detailImageField !== 'undefined' && detailImageField) { %>
                itemModel.<%= detailImageField %>Url = processImage(itemModel.<%= detailImageField %>);<% } %>
                if (!itemModel.<%= (typeof detailHeaderField !== 'undefined' && detailHeaderField) || headerField || '_no_header_specified_' %>) {
                    itemModel.<%= (typeof detailHeaderField !== 'undefined' && detailHeaderField) || headerField || '_no_header_specified_' %> = String.fromCharCode(160);
                }
                <%= name %>.set('currentItem', itemModel);
            },
            currentItem: null<% } %>
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('<%= name %>', <%= name %>);
        });
    } else {
        parent.set('<%= name %>', <%= name %>);
    }<% if (source === 'jsdo') { %>
    parent.set('onShow', function () {
        dataProvider.loadCatalogs().then(function _catalogsLoaded() {
            var jsdoOptions = <%= name %>.get('_jsdoOptions'),
            jsdo = new progress.data.JSDO(jsdoOptions),
            dataSourceOptions = <%= name %>.get('_dataSourceOptions'),
            dataSource;

            dataSourceOptions.transport.jsdo = jsdo;
            dataSource = new kendo.data.DataSource(dataSourceOptions);
            <%= name %>.set('dataSource', dataSource);
        });
    });
<% } %>
})(app.<%= parent %>);

// START_CUSTOM_CODE_<%= name %>
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

<% if (source === 'jsdo') { %>    // you can handle the beforeFill / afterFill events here. For example:
    /*
    app.<%= parent %>.<%= name %>.get('_jsdoOptions').events = {
        'beforeFill' : [ {
            scope : app.<%= parent %>.<%= name %>,
            fn : function (jsdo, success, request) {
                // beforeFill event handler statements ...
            }
        } ]
    };
    */
<% } %>// END_CUSTOM_CODE_<%= name %>
