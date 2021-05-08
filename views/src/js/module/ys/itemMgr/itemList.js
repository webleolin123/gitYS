/**

 @Name：事项清单
 @Author：gaoli

 */
layui.config({
    base: '../../../js/',
    version: new Date().getTime()
}).extend({
    tableSpan: 'lib/tableSpan'
}).use(['eleTree', 'layer', 'form', 'laytpl', 'common', 'element', 'laydate', 'upload', 'tableSpan'],
    function () {
        var form = layui.form;
        var common = layui.common;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var tableSpan = layui.tableSpan;
        var tree = layui.eleTree;
        var isAuth = common.publicConfig().isPreviewFile;//获取文件预览权限
        var isFlowAccess = common.getSystemFlowAccess();

        var treeCurrentData = {};
        var itemListSelectedList = [];
        var itemListMap = {};
        var itemListMapLine = {};
        var versionListMap = {};
        var detailItemMap = {};

        var baseUrl = '../../../../';

        var gloVariable = {
            seId: null,
            selectedListId: null,
            listId: null
        };
        var listVersion;
        var isNew = false;

        var dom = {
            viewItemDetail: $('.viewItemDetail'),
            addEditItemDetail: $('.addEditItemDetail'),
            emptyBox: $('.emptyBox'),
            versionList: $('.versionList'),
            selectedTable: $('#selectedTable'),
            itemDetailName: $('.itemDetailName'),
            descName: $('.descName'),
            fileName: $('.fileName'),
            flowName: $('.flowName'),
            listDate: $('.listDate'),
            addOrEditPanel: $('.addOrEditPanel'),
            viewPanel: $('.viewPanel')
        };

        var eventHandle = {

            //状态位
            statusIndex: function (ggDelStatus, ggEnStatus, invalidDate) {
                // 1:删除 2：有效 3：未生效 4：已失效
                var index = null;

                if (ggEnStatus === "0") {
                    index = 3
                }
                if (ggEnStatus === "1") {
                    index = 2
                }

                if (ggDelStatus === "1") {//已删除
                    index = 1;
                }

                if (invalidDate < new Date().getTime()) {
                    index = 4
                }
                return index;
            },

            //表格合并处理
            tableMerge: function (elem, data, type) {

                $('.thAddCol').remove();
                $('.itemCodeCol').remove();
                var itemListHtml = '';
                var ids = [];
                itemListMapLine = {};

                for (var i = 0; i < data.length; i++) {
                    if (type === 'view') {

                        if (!data[i]['isChecked'] || data[i]['isChecked'] !== "1") {
                            continue;
                        }
                    }

                    itemListHtml += '<tr data-id="' + data[i]['id'] + '">';
                    itemListMap[data[i]['id']] = data[i];
                    ids.push(data[i]['id']);

                    //数据生成
                    itemListHtml += '<td data-id="' + data[i]['id'] + '"  data-name1="' + data[i]['name1'] + '">' + data[i]['name1'] + '</td>';
                    itemListHtml += '<td data-id="' + data[i]['id'] + '"  data-name2="' + data[i]['name2'] + '">' + data[i]['name2'] + '</td>';
                    itemListHtml += '<td data-id="' + data[i]['id'] + '"  data-name3="' + data[i]['name3'] + '">' + data[i]['name3'] + '</td>';
                    var addBtnLine = '', addBtnLineTrigger = '';

                    if (type === 'edit') {
                        //添加操作行
                        addBtnLineTrigger = 'addBtnLineTrigger';
                        addBtnLine = '<i style="float: right;margin-right: 5px" title="添加" data-code="' + data[i]['catalogCode'] + '" data-id="' + data[i]['id'] + '" class="addColBtn fa fa-plus-circle primary"></i>';

                    }

                    var catalogCode = '';

                    if (type === 'next') {
                        catalogCode = 'data-catalogCode=' + data[i]['catalogCode'];
                    }

                    if (type === 'next' && data[i]['isChecked'] && data[i]['isChecked'] === "1") {
                        itemListHtml += '<td style="cursor: pointer;text-align: center" class="tdSelected" data-id="' + data[i]['id'] + '" ' + catalogCode + '>' + data[i]['catalogCode'] + '</td>';

                        //数据导入itemListSelectedList

                        if (common.arrayIndexOf(itemListSelectedList, 'id', data[i]['id']) === undefined || common.arrayIndexOf(itemListSelectedList, 'id', data[i]['id']) === -1) {

                            itemListSelectedList.push(data[i]);

                        }

                    } else {
                        itemListHtml += '<td data-code="' + data[i]['catalogCode'] + '" class="' + addBtnLineTrigger + '" style="cursor: pointer;text-align: center" data-id="' + data[i]['id'] + '"  ' + catalogCode + '">' + data[i]['catalogCode'] + addBtnLine + '</td>';
                    }


                    //判断查看状态
                    if (type === 'view') {
                        var itemNameHtml = '';
                        if (data[i]['itemList'] && data[i]['itemList'].length > 0) {
                            //遍历数组
                            $.map(data[i]['itemList'], function (item, index1) {
                                itemListMapLine[item.itemId] = item;
                                // itemNameHtml += '<div  class="singleItemDetail status status-' + item.seLevel + '"><span>' + item.itemName + '</span></div>';
                                itemNameHtml += '<div data-itemId="' + item.itemId + '" class="a-link singleItemDetail detailShow itemToolTip">' + item.itemName + '</div>';
                            });
                        } else {
                            itemNameHtml = '';
                        }
                        itemListHtml += '<td class="itemCodeCol" style="padding: 0" data-id="' + data[i]['id'] + '"  data-itemList="-">' + itemNameHtml + '</td>';

                    }


                    //判断编辑的状态
                    if (type === 'edit') {
                        var html = '';
                        if (data[i]['itemList'] && data[i]['itemList'].length > 0) {
                            //遍历数组
                            $.map(data[i]['itemList'], function (item, index1) {
                                detailItemMap[item.itemId] = item;
                                if(item.uploadStatus === '2'){
                                    var bakHtml =  '<i data-itemId="' + item.itemId + '" title="撤回" class="singleItemReportBack fa fa-mail-reply"></i>';
                                    html += '<div data-itemId="' + item.itemId + '"  class="singleItemDetail status status-5"><span  data-itemId="' + item.itemId + '" class="detailShow">' + item.itemName + '</span>' +
                                        '<div class="singleItemOper">' + bakHtml +
                                        '</div>' +
                                        '</div>';
                                } 
                                else if(item.uploadStatus === '1'){
                                     //销毁和还原的判断
                                     var deHtml = '';
                                     if (item.ggDelStatus === "1") {
                                         deHtml = '<i data-itemId="' + item.itemId + '" title="还原" class="singleItemBack fa fa-mail-reply"></i>';
                                         html += '<div data-itemId="' + item.itemId + '"  class="singleItemDetail status status-' + eventHandle.statusIndex(item.ggDelStatus, item.ggEnStatus, item.invalidDate) + '"><span  data-itemId="' + item.itemId + '" class="detailShow">' + item.itemName + '</span>' +
                                         '<div class="singleItemOper">' +
                                         deHtml +
                                         '</div>' +
                                         '</div>';

                                     } else {
                                         deHtml = '<i data-itemId="' + item.itemId + '" title="销毁" class="singleItemDelete icon iconfont icon-button-sc-2"></i>';
                                         html += '<div data-itemId="' + item.itemId + '"  class="singleItemDetail status status-' + eventHandle.statusIndex(item.ggDelStatus, item.ggEnStatus, item.invalidDate) + '"><span  data-itemId="' + item.itemId + '" class="detailShow">' + item.itemName + '</span>' +
                                         '<div class="singleItemOper">' +
                                         '<i data-itemId="' + item.itemId + '" data-itemName="' + item.itemName + '"  data-code="' + data[i]['catalogCode'] + '" data-id="' + data[i]['id'] + '" title="编辑" class="singleItemEdit fa fa-edit"></i>' + deHtml +
                                         '</div>' +
                                         '</div>';
                                     }


 
                                     
                                }else {
                                    //生效和失效的判断
                                    var enHtml = '';
                                    if (item.ggEnStatus === "1") {
                                        enHtml = '<i data-itemId="' + item.itemId + '" title="失效" class="singleItemDisable fa fa-frown-o"></i>'
                                    } else {

                                        enHtml = '<i data-itemId="' + item.itemId + '" title="生效" class="singleItemEnable fa fa-smile-o"></i>'
                                    }

                                    //删除和还原的判断
                                    var deHtml = '';
                                    if (item.ggDelStatus === "1") {
                                        deHtml = '<i data-itemId="' + item.itemId + '" title="还原" class="singleItemBack fa fa-mail-reply"></i>'
                                    } else {
                                        deHtml = '<i data-itemId="' + item.itemId + '" title="删除" class="singleItemDelete icon iconfont icon-button-sc-2"></i>'
                                    }

                                    html += '<div data-itemId="' + item.itemId + '"  class="singleItemDetail status status-' + eventHandle.statusIndex(item.ggDelStatus, item.ggEnStatus, item.invalidDate) + '"><span  data-itemId="' + item.itemId + '" class="detailShow">' + item.itemName + '</span>' +
                                        '<div class="singleItemOper">' +
                                        '<i data-itemId="' + item.itemId + '" data-itemName="' + item.itemName + '"  data-code="' + data[i]['catalogCode'] + '" data-id="' + data[i]['id'] + '" title="编辑" class="singleItemEdit fa fa-edit"></i>' + enHtml + deHtml +
                                        '</div>' +
                                        '</div>';
                                }


                            });
                        } else {
                            itemNameHtml = '';
                        }
                        //新增行数据存放地
                        itemListHtml += '<td class="itemCodeCol" style="padding: 0" data-id="' + data[i]['id'] + '">' + html + '</td>';
                    }
                    itemListHtml += '</tr>';
                }

                if (type === 'edit') {
                    //判断是编辑的状态
                    $(elem + ' thead tr').append('<td class="itemCodeCol" style="min-width: 100px">事项名称</td>');
                } else if (type === 'view') {

                    //查看状态
                    $('.step-one').show();
                    $('.step-two').hide();
                    $(elem + ' thead tr').append('<td class="itemCodeCol" style="min-width: 100px">事项名称</td>');
                } else if (type === 'next') {
                    //下一步状态
                    // $(elem+' thead tr').append('<th style="width: 15px" class="thAddCol"></th>');
                }

                $(elem + ' tbody').html(itemListHtml);
                common.buttonLimit();
                // 表格数据合并
                for (var i = 0; i < data.length; i++) {
                    if (i <= 2) {
                        tableSpan.table_rowspan(elem, i + 1);
                    }
                }

                gloVariable.selectedListId = ids.join(',');
                //版本列表高度设置
                // eventHandle.versionListHeight();


            },


            //版本列表高度
            versionListHeight: function () {
                //高度设置
                dom.versionList.css({
                    height: 0
                });
                dom.versionList.css({
                    height: $(document).height() - 240 + 'px'
                });
            },


            //清单筛选后 进行处理
            itemListSelectedSet: function (type, iSaveFlag) {
                if (!type) {
                    type = 'yesBack'
                } else {
                    type = 'noBack';
                }

                //空值判断

                if (!$('[name=listName]').val()) {
                    layer.msg('请输入清单名称');
                    return false;
                }

                if (itemListSelectedList.length === 0) {
                    layer.msg('请点击事项目录编码进行筛选');
                    return false
                }

                var currentListId;

                if (gloVariable.listId) {
                    //说明是修改状态
                    currentListId = gloVariable.listId
                } else {
                    isNew = true;
                    currentListId = common.uuid();
                }

                //数据保存
                var params = {
                    effectiveDate: $('[name=date1]').val().split(' - ')[0],//生效日期
                    invalidDate: $('[name=date1]').val().split(' - ')[1],//失效日期
                    listId: currentListId,//事项集合id
                    listName: $('[name=listName]').val(),//事项清单名称
                    listVersion: $('[name=listVersion]').val(),//版本号
                    listYear: $('[name=versionYear]').val(),//事项清单年份
                    remark: $('[name=remark]').val(),//描述
                    seId: $('#currentEnterprise').attr('data-seid'), //企业id
                    iSaveFlag: iSaveFlag,
                    // flowLabel: $('[name=flowLabel]').attr('data-flowLabel'),
                    flowLabel: $('[name=flowLabel]').val(),
                    flowName: $('[name=flowLabel]').attr('data-flowName')
                };

                if (iSaveFlag === 0) {
                    if (!$('[name=flowLabel]').val()) {
                        layer.msg('请选择流程');
                        return false;
                    }
                }


                function saveBack(res) {
                    if (res.success) {
                        $('.step-one').fadeOut();
                        $('.step-two').fadeIn();
                        $('.step1').removeClass('selected');
                        $('.step2').addClass('selected');
                        gloVariable.listId = currentListId;
                        var ids = [];
                        $.map(itemListSelectedList, function (item) {
                            ids.push(item['id']);
                        });

                        //事项清单关联事项目录保存
                        common.fetchPost('catalog/tiolItemList/saveTiolItemListCatalogList', {
                            listId: currentListId,
                            ids: ids.join(','),
                        }, function (dataBack) {
                            if (dataBack.success) {
                                //已筛选的数据导入表格中

                                //清单列表导入
                                common.fetchGet('catalog/tiolItemList/selectTiolCatalog?listid=' + currentListId + '&type=2', function (dataBack) {

                                    var list = dataBack.list || [];
                                    var arr = [];
                                    if (list.length > 0) {
                                        $.map(list, function (item) {
                                            if (item.isChecked === '1') {
                                                arr.push(item);
                                            }
                                        });
                                    }
                                    eventHandle.tableMerge('#selectedTable', arr, 'edit');

                                });
                                // //刷新列表
                                // eventHandle.currentEnterprise({
                                //     seName: treeCurrentData.name,
                                //     seId: treeCurrentData.id,
                                // }, $('[name=versionYear]').val());

                            } else {
                                layer.msg(dataBack.resultMessage, {
                                    time: 3000
                                });
                            }

                        }, function (error) {
                            layer.msg(error.resultMessage, {
                                time: 3000
                            });
                        });


                    } else {
                        layer.alert(res.resultMessage, {
                            time: 3000
                        });
                        return false;
                    }
                }

                // if (gloVariable.listId) {
                if (isNew == false) {
                    //修改状态
                    common.fetchPost('catalog/tiolItemList/saveTiolItemList', params, function (res) {
                        if (type === 'yesBack') {
                            saveBack(res);
                        } else {
                            layer.msg('保存成功');
                            eventHandle.currentEnterprise({
                                seName: treeCurrentData.name,
                                seId: treeCurrentData.id,
                            }, $('[name=versionYear]').val());
                        }

                    }, function (err) {
                        layer.alert(err.resultMessage, {
                            time: 3000
                        });
                        return false;
                    });
                } else {
                    //新增状态
                    common.fetchPost('catalog/tiolItemList/insertTiolItemList', params, function (res) {
                        if (type === 'yesBack') {
                            saveBack(res);
                        } else {
                            layer.msg('保存成功', {
                                time: 3000
                            });
                            eventHandle.currentEnterprise({
                                seName: treeCurrentData.name,
                                seId: treeCurrentData.id,
                            }, $('[name=versionYear]').val());
                        }
                    }, function (err) {
                        layer.alert(err.resultMessage, {
                            time: 3000
                        });
                        return false;
                    });
                }
            },

            //新增事项清单
            addColFun: function (dataId, catalogCode, itemId, itemName) {
                if (!listVersion) {
                    listVersion = $('[name=listVersion]').val();
                }
                var urlParam = '?catalogId=' + dataId + '&catalogChar=' + catalogCode + (gloVariable.listId ? ('&itemListId=' + gloVariable.listId) : '') + (itemId ? ('&itemId=' + itemId) : '') + '&itemName=' + itemName + '&listVersion=' + listVersion + '&listId=' + gloVariable.listId;
//debugger;
                var addColBtn = layer.open({
                    title: '事项管理',
                    type: 2,
                    area: ['650px', '480px'],
                    shadeClose: false,
                    // content: $('.itemMgrLayer').html(),
                    content: baseUrl + 'src/page/ys/itemMgr/itemFillEdit.html' + urlParam,
                    success: function (obj) {
                        form.render();
                    },
                    // btn: ['确定', '取消'],
                    // btnAlign: 'c',
                    // yes: function (layero, obj) {
                    //     //默认新增列展现，并且对应的添加一行
                    //
                    //     var parent = $(obj.selector);
                    //     if (!parent.find('[name=itemName]').val()) {
                    //         layer.msg('请输入事项名称');
                    //         return false;
                    //     }
                    //
                    //     //获取当前行的index
                    //     var index = common.arrayIndexOf(itemListSelectedList, 'id', dataId);
                    //
                    //     if (!itemListSelectedList[index]['itemList']) {
                    //         itemListSelectedList[index]['itemList'] = [];
                    //     }
                    //
                    //     itemListSelectedList[index]['itemList'].push({});
                    //
                    //     eventHandle.tableMerge('#selectedTable', itemListSelectedList, 'edit');
                    //
                    //     layer.msg('保存成功');
                    //     layer.close(addColBtn);
                    //
                    // },
                    // btn1: function (layero, obj) {
                    //     layer.close(addColBtn);
                    // }
                });
            },

            //编辑事项清单
            editColFun: function (dataId) {
                var editColBtn = layer.open({
                    title: '事项编辑',
                    type: 1,
                    area: ['70%'],
                    shadeClose: false,
                    content: $('.itemMgrLayer').html(),
                    btn: ['确定', '取消'],
                    btnAlign: 'c',
                    success: function (obj) {
                        form.render();
                    },
                    yes: function (layero, obj) {
                        //默认新增列展现，并且对应的添加一行

                        var parent = $(obj.selector);
                        if (!parent.find('[name=itemName]').val()) {
                            layer.msg('请输入事项名称', {
                                time: 3000
                            });
                            return false;
                        }

                        //获取当前行的index
                        var index = common.arrayIndexOf(itemListSelectedList, 'id', dataId);


                        if (!itemListSelectedList[index]['itemList']) {
                            itemListSelectedList[index]['itemName'] = [];
                        }


                        itemListSelectedList[index]['itemList'].push({
                            sid: dataId,
                            name: parent.find('[name=itemName]').val(),
                            status: 3
                        });

                        eventHandle.tableMerge('#selectedTable', itemListSelectedList, 'edit');

                        layer.msg('保存成功', {
                            time: 3000
                        });
                        layer.close(editColBtn);

                    },
                    btn1: function (layero, obj) {
                        layer.close(addColBtn);
                    }
                });
            },

            //当前事项清单查看面板
            currentItemDetailView: function (currentData) {
                dom.addOrEditPanel.hide();
                dom.viewPanel.show();

                if (currentData) {
                    var params = {
                        listVersion: currentData.listVersion,
                        listId: currentData.listId,
                        listYear: currentData.listYear
                    };
                    listVersion = currentData.listVersion;
                    dom.addEditItemDetail.hide();
                    dom.viewItemDetail.show();

                    dom.addOrEditPanel.hide();
                    dom.viewPanel.show();

                    //数据导入
                    common.fetchGet('catalog/tiolItemList/selectTiolItemById?id=' + currentData.listId, function (res) {
                        var data = res.object;
                        if (!$.isEmptyObject(data)) {
                            dom.itemDetailName.text(data.listName || '-');
                            // dom.fileName.text('-');
                            dom.flowName.text((data.flowName) ? data.flowName : '-');

                            dom.descName.text(data.remark || '-');
                            if (data.effectiveDate && data.invalidDate) {
                                dom.listDate.text(common.dateFormat(data.effectiveDate).substring(0, 10) + ' - ' + common.dateFormat(data.invalidDate).substring(0, 10));
                            } else {
                                dom.listDate.text('-');
                            }

                            //文件信息载入
                            common.fetchGet('zuul/dfsmgr/file/getFileByResIdAndFileType?id=' + currentData.listId + '&type=ITEMLIST', function (res) {

                                var data = res.list || [];

                                var html = '';

                                if (data.length > 0) {

                                    $.map(data, function (item) {
                                        var fileName = item.fiName + '.' + item.fiSuffix;

                                        html += '<div style="margin-right: 10px" class="fileDownload a-link" name="fileDownload" fileId="' + item.fiId + '" fiType="' + item.fiSuffix + '">' + fileName + '</div>';

                                        // html += '<li data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                        //     '      <div class="fileSingleBox">\n' +
                                        //     '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                        //     '          <p>\n' +
                                        //     '              <i class="fa fa-file-text-o"></i><b\n' +
                                        //     '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                        //     '          </p>\n' +
                                        //     '          <div class="box-close-btn fileDelete"><i class="fa fa-close"></i></div>\n' +
                                        //     '      </div>\n' +
                                        //     '  </li>';
                                    });

                                    dom.fileName.html(html);

                                    $('[name=fileDownload]').off().on('click', function () {
                                        if (isAuth) {
                                            common.pdfPreview($(this).attr('fileId'), $(this).attr('fiType'));
                                        } else {
                                            layer.msg('无预览权限');
                                            return false;
                                        }
                                    });

                                } else {
                                    dom.fileName.html('-');
                                }

                            });


                        } else {
                            layer.msg('数据返回错误', {
                                time: 3000
                            });
                        }


                        //清单列表导入
                        common.fetchGet('catalog/tiolItemList/selectTiolCatalog?listid=' + currentData.listId + '&type=2', function (dataBack) {
                            var list = dataBack.list || [];
                            eventHandle.tableMerge('#mergeViewTable', list, 'view');

                        });
                    });

                }


            },


            //currentEnterprise 当前企业信息
            currentEnterprise: function (enterprise, version, copyBack) {
                var versionArea = $('.ver-list');
                //情况公共变量
                itemListSelectedList = [];
                itemListMap = {};
                versionListMap = {};
                detailItemMap = {};

                versionArea.empty();

                $('#currentEnterprise').text(enterprise.seName).attr('data-seId', enterprise.seId);

                gloVariable.seId = enterprise.seId;

                //版本信息列表导入
                var params = {
                    listYear: version,
                    seId: enterprise.seId
                };
                common.fetchPost('catalog/tiolItemList/selectTiolItemListList', params, function (resData) {

                    var data = resData.list || [];
                    versionListMap = {};
                    var html = '';
                    if (data.length > 0) {

                        //数据导入并进入查看面板
                        dom.addEditItemDetail.hide();
                        dom.viewItemDetail.show();
                        dom.emptyBox.hide();
                        $.map(data, function (itemm, index) {

                            if (!!itemm) {
                                versionListMap[itemm.listId] = itemm;

                                var statusText, statusClass;
                                if (itemm['ggEnStatus'] === '1') {
                                    statusText = '有效';
                                    statusClass = ' status-success ';
                                } else {
                                    statusText = '失效';
                                    statusClass = ' status-danger ';
                                }
                                if(!(itemm.listVersion == '历史')){
                                    html += '<li class="' + statusClass + '"  data-listId="' + itemm.listId + '">' +
                                    '<span class="icon-status"></span>' +
                                    '<span class="name">' + itemm.listVersion + '</span>' +
                                    '<div class="btn-op">' +
                                    '<div class="operBox">' +
                                    '   <div data-listId="' + itemm.listId + '" permission-btn="itemEnable" class="versionListEnStatus"><i class="fa fa-star " ></i>生效</div>\n' +
                                    '   <div data-listId="' + itemm.listId + '" permission-btn="itemCopy" class="versionListCopy"><i class="fa fa-copy " ></i>复制</div>\n' +
                                        '   <div data-listId="' + itemm.listId + '" permission-btn="itemEdit" class="versionListEdit"><i class="fa fa-edit "></i>修改</div>\n' +
                                        '   <div data-listId="' + itemm.listId + '" permission-btn="itemDel" class="versionListDelete"><i class="icon iconfont icon-button-sc-2 " ></i>删除</div>\n' +
                                    '   <div style="display: ' + ((isFlowAccess) ? 'none' : 'block') + '" data-listId="' + itemm.listId + '" permission-btn="itemReport" class="versionListReport"><i class="icon iconfont icon-ys-sjsbguanli" ></i>上报</div>\n' +
                                    '   <div style="display: ' + ((isFlowAccess || itemm.uploadStatus !== '2') ? 'none' : 'block') + '" data-listId="' + itemm.listId + '" permission-btn="itemReport" class="versionListBack"><i class="fa fa-mail-reply" ></i>退回</div>\n' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';
                                }else{
                                    html += '<li class="' + statusClass + '"  data-listId="' + itemm.listId + '">' +
                                    '<span class="icon-status"></span>' +
                                    '<span class="name">' + itemm.listVersion + '</span>' +
                                    '<div class="btn-op">' +
                                        '<div class="operBox">' +
                                        '   <div data-listId="' + itemm.listId + '" permission-btn="itemCopy" class="versionListCopy"><i class="fa fa-copy " ></i>复制</div>\n' +
                                        '   <div data-listId="' + itemm.listId + '" permission-btn="itemEdit" class="versionListEdit"><i class="fa fa-edit "></i>修改</div>\n' +
                                        '   <div data-listId="' + itemm.listId + '"  permission-btn="itemDel" class="versionListDelete"><i class="icon iconfont icon-button-sc-2 " ></i>删除</div>\n' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';
                                }
                            }
                        });

                        versionArea.append(html);
                        common.buttonLimit();

                        //版本清单点击 点击
                        versionArea.find('li').off().on('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            $('html,body').animate({scrollTop: 0}, 'slow');
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            versionArea.find('li').removeClass('selected');
                            $(this).addClass('selected');
                            //进入查看状态
                            eventHandle.currentItemDetailView(currentData);

                        });

                        //版本清单编辑
                        $('.versionListEdit').off().on('click', function (e) {
                            e.stopPropagation();
                            $('.ydListTab').show();
                            $('html,body').animate({scrollTop: 0}, 'slow');
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            $(this).parent().parent().parent().siblings().removeClass('selected');
                            $(this).parent().parent().parent().addClass('selected');
                            eventHandle.versionListEdit(currentData);
                            $('#prevStep').click();
                        });

                        //版本清单上报
                        $('.versionListReport').off().on('click', function (e) {
                            $('.ydListTab').hide();
                            e.stopPropagation();
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            var layerConfirm = layer.confirm('确定要上报该事项清单吗？', {
                                icon: 3,
                                title: '提示',
                                offset: '150px'
                            }, function (index) {
                                var param = {
                                    listId : currentData.listId
                                };
                                layer.close(layerConfirm);
                                var layerLoader = common.layerLoader();
                                common.fetchPost('catalog/tiolItemList/reportItemList',param, function (res) {
                                    if (res.success) {
                                        layer.close(index);
                                        layer.close(layerLoader);
                                        layer.msg('上报成功', {
                                            time: 3000
                                        });
                                        $('#refreshBtn').click();
                                    } else {
                                        layer.close(layerLoader);
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                }, function (err) {
                                    layer.close(layerLoader);
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                })
                            }, function () {

                            });

                        });
                        //版本清单退回
                        $('.versionListBack').off().on('click', function (e) {
                            $('.ydListTab').hide();
                            e.stopPropagation();
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            layer.confirm('确定要回退该事项清单吗？', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                                var param = {
                                    listId: currentData.listId
                                };
                                // var layerLoader=common.layerLoader();
                                // common.fetchPost('catalog/tiolItemList/reportItemList',param, function (res) {
                                //     if (res.success) {
                                //         layer.close(index);
                                //         layer.close(layerLoader);
                                //         layer.msg('上报成功', {
                                //             time: 3000
                                //         });
                                //         $('#refreshBtn').click();
                                //     } else {
                                //         layer.close(layerLoader);
                                //         layer.alert(res.resultMessage, {
                                //             time: 3000
                                //         });
                                //     }
                                // }, function (err) {
                                //     layer.close(layerLoader);
                                //     layer.alert(err.resultMessage, {
                                //         time: 3000
                                //     });
                                // })
                            });

                        });

                        //版本清单删除
                        $('.versionListDelete').off().on('click', function (e) {
                            $('.ydListTab').hide();
                            e.stopPropagation();
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            layer.confirm('确定删除？', {icon: 3, title: '提示', offset: '150px'}, function (index) {

                                common.fetchGet('catalog/tiolItemList/logicDelTiolItemList?ids=' + currentData.listId, function (res) {
                                    if (res.success) {
                                        layer.close(index);
                                        layer.msg('删除成功', {
                                            time: 3000
                                        });

                                        //刷新数据
                                        eventHandle.currentEnterprise({
                                            seName: treeCurrentData.name,
                                            seId: treeCurrentData.id,
                                        }, $('[name=versionYear]').val());

                                    } else {
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                }, function (err) {
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                })
                            });

                        });
                        //版本启动
                        $('.versionListEnStatus').off().on('click', function (e) {
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            layer.confirm('确定启动？', {icon: 3, title: '提示', offset: '150px'}, function (index) {

                                common.fetchGet('catalog/tiolItemList/enableItemListById?id=' + currentData.listId, function (res) {
                                    if (res.success) {
                                        layer.close(index);
                                        layer.msg('启动成功', {
                                            time: 3000
                                        });

                                        //刷新数据
                                        eventHandle.currentEnterprise({
                                            seName: treeCurrentData.name,
                                            seId: treeCurrentData.id,
                                        }, $('[name=versionYear]').val());

                                    } else {
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                }, function (err) {
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                })
                            });
                        });
                        //版本复制
                        $('.versionListCopy').off().on('click', function (e) {
                            $('.ydListTab').hide();
                            e.stopPropagation();
                            var currentData = versionListMap[$(this).attr('data-listId')];
                            layer.confirm('确定复制该版本？', {icon: 3, title: '提示', offset: '150px'}, function (index) {

                                common.fetchPost('catalog/tiolItemList/initTiolItemList', {
                                    listVersion: currentData.listVersion,
                                    listId: currentData.listId,
                                    listYear: currentData.listYear

                                }, function (res) {
                                    if (res.success) {
                                        layer.close(index);
                                        layer.msg('复制成功', {
                                            time: 3000
                                        });

                                        //刷新数据
                                        eventHandle.currentEnterprise({
                                            seName: treeCurrentData.name,
                                            seId: treeCurrentData.id,
                                        }, $('[name=versionYear]').val(), true);

                                    } else {
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                }, function (err) {
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                })
                            });

                        });



                        if (!copyBack) {
                            //默认点有效的清单
                            if (versionArea.find('.status-success')[0]) {
                                versionArea.find('.status-success').click();
                            } else {
                                //点击第一项
                                versionArea.find('li').eq(0).trigger('click');
                            }

                        } else {
                            //点击第一项的编辑按钮
                            versionArea.find('li').eq(0).find('.versionListEdit').trigger('click');
                        }

                    } else {
                        //如果没有版本信息， 则进入新增页面

                        //清空面板信息
                        $('[name=date1]').val('');
                        $('[name=remark]').val('');
                        $('[name=listName]').val('');
                        $('[name=flowLabel]').val('');
                        $('#fileUploadListBox ul li[data-fiid]').remove();

                        dom.addEditItemDetail.show();
                        dom.viewItemDetail.hide();
                        dom.emptyBox.show();
                        dom.viewPanel.hide();
                        dom.addOrEditPanel.show();

                        $('[name=listVersion]').val($('[name=versionYear]').val() + (JSON.stringify(new Date().getMonth() + 1)));

                        //清单列表加载
                        common.fetchGet('catalog/tiolCatalog/selectTiolCatalog', function (res) {

                            var resData = res.list || [];

                            eventHandle.tableMerge('#mergeTable', resData, 'next');

                        });

                    }

                }, false);


            },
            fileDataSet: function (parent, type, id) {
                common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + id + '&type=' + type, function (res) {

                    var data = res.list || [];

                    var html = '';
                    parent.find('[data-fiId]').remove();
                    if (data.length > 0) {
                        $.map(data, function (item) {
                            var fileName = item.fiName + '.' + item.fiSuffix;

                            html += '<li data-fiType="' + item.fiSuffix + '" data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                '      <div class="fileSingleBox">\n' +
                                '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                '          <p>\n' +
                                '              <i class="fa fa-file-text-o"></i><b\n' +
                                '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                '          </p>\n' +
                                '          <div class="box-close-btn fileDelete"><i class="fa fa-close"></i></div>\n' +
                                '      </div>\n' +
                                '  </li>';
                        });
                        parent.append(html);
                    } else {
                    }

                });
            },

            //版本清单编辑
            versionListEdit: function (currentData) {
                gloVariable.listId = currentData.listId;

                dom.viewItemDetail.hide();
                dom.addEditItemDetail.show();
                dom.viewPanel.hide();

                dom.addOrEditPanel.show();
                //数据导入
                common.fetchGet('catalog/tiolItemList/selectTiolItemById?id=' + currentData.listId, function (res) {

                    var data = res.object;
                    if (!$.isEmptyObject(data)) {
                        $('[name=gloItemId]').val(currentData.listId);

                        $('[name=listName]').val(data.listName);
                        $('[name=listVersion]').val(data.listVersion);
                        $('[name=remark]').val(data.remark);
                        $('[name=flowName]').val((data.flowName ? data.flowName : '-'));
                        $('[name=flowName]').attr('data-flowName', data.flowName);

                        $('[name=flowLabel]').val(data.flowLabel);

                        if (data.effectiveDate && data.invalidDate) {
                            $('[name=date1]').val(common.dateFormat(data.effectiveDate).substring(0, 10) + ' - ' + common.dateFormat(data.invalidDate).substring(0, 10))
                        } else {
                            $('[name=date1]').text('');
                        }

                        //佐证
                        eventHandle.fileDataSet($('#fileUploadListBox ul'), 'ITEMLIST', currentData.listId);

                    } else {
                        layer.msg('数据返回错误', {
                            time: 3000
                        });
                    }

                    common.fetchGet('catalog/tiolItemList/selectTiolCatalog?listid=' + currentData.listId + '&type=2', function (dataBack) {
                        var list = dataBack.list || [];
                        listVersion = $('[name=listVersion]').val();
                        eventHandle.tableMerge('#mergeTable', list, 'next');

                    });
                });

            },

            domEvent: function () {


                //附件删除
                $(document).off('click', '.fileDelete');
                $(document).on('click', '.fileDelete', function () {
                    var current = $(this).parent().parent();
                    var fileName = current.attr('fileName');
                    var fileId = current.attr('data-fiId');
                    layer.confirm("确定删除【 " + fileName + "】文件?", {
                        icon: 3,
                        title: '提示',
                        offset: '150px'
                    }, function (index) {
                        layer.close(index);
                        common.fetchDelete("/dfsmgr/file/deleteById?id=" + fileId, function (res) {
                            if (res.success) {
                                layer.msg('删除成功', {
                                    time: 3000
                                });
                                current.remove();
                            } else {
                                layer.msg('删除失败', {
                                    time: 3000
                                });
                            }
                        }, function (err) {
                            layer.msg('删除失败', {
                                time: 3000
                            });
                        });
                    });
                });
                //流程选择确定
                $('#saveFlowBtn').off().on('click', function () {
                    var parent = $("#flowIframe").contents();

                    $('[name=flowLabel]').attr({
                        // 'data-beiId': beiId,
                        'data-flowLabel': parent.find('#label').val(),
                        'data-flowName': parent.find('#name').val(),
                        // 'data-flowState': 0,
                        // 'data-flowStatusList': res.object.stateinfo.name
                    });
                    $('[name=flowLabel]').val(parent.find('#label').val());
                    $('[name=flowName]').val(parent.find('#name').val());

                    // eventHandle.meetingBaseInfoSave(false);
                    //
                    //
                    // var parent = $("#flowIframe").contents();
                    //
                    // var userInfo = common.getUserInfo();
                    //
                    // if (!parent.find('#label').val()) {
                    //
                    //     layer.msg('请先选择流程');
                    //     return false;
                    // }
                    //
                    // common.fetchPost('flowEngine/engineBase/draftRequest', {
                    //     businessId: editMeetingId,
                    //     ptCompanyId: userInfo.seId,
                    //     ptLabel: parent.find('#label').val(),
                    //     ptVersion: parent.find('#version').val(),
                    //     reject: false,
                    //     stateId: 'step10'
                    // }, function (res) {
                    //     if (res.success && res.object) {
                    //
                    //         common.fetchPost('sasprocessmgr/businessEngineInfo/addBusinessEngineInfo', {
                    //             businessId: editMeetingId,
                    //             businessSubject: $('[name=meetingName]').val(),
                    //             flowLabel: parent.find('#label').val(),
                    //             businessTypeId: 'meeting',
                    //             businessTypeName: '决策会议',
                    //             drafterId: userInfo.suId,
                    //             drafterName: userInfo.suName,
                    //             flowPiid: res.object.piid,
                    //             flowState: 0,
                    //             approveState: 0,
                    //             formFlowState: '',
                    //             handleDatetime: '',
                    //             handleOpinion: '',
                    //             todoUserList: userInfo.suId,
                    //             flowUpdatetime: new Date(),
                    //             flowStateId: res.object.stateinfo.sid,
                    //             flowStateName: res.object.stateinfo.name
                    //         }, function (dataBack) {
                    //
                    //             if (dataBack.success) {
                    //
                    //                 var beiId = dataBack.object;
                    //
                    //                 //写入标签
                    //                 $('[name=flowLabel]').attr({
                    //                     'data-beiId': beiId,
                    //                     'data-flowLabel': parent.find('#label').val(),
                    //                     'data-flowState': 0,
                    //                     'data-flowStatusList': res.object.stateinfo.name
                    //                 });
                    //                 $('[name=flowLabel]').val(parent.find('#label').val());
                    //
                    //                 //保存会议
                    //                 eventHandle.meetingBaseInfoSave('流程绑定成功');
                    //
                    //             }
                    //         })
                    //     } else {
                    //
                    //     }
                    // }, function (err) {
                    //
                    // });

                    $('.leftContendBox').css({
                        width: '0px',
                        // 'box-shadow':'none',
                        // opacity:0
                    });
                    $('body,html').removeClass('stopScrop');
                    $('.mainMack').fadeOut();

                });

                $('#cancleFlowBtn').off().on('click', function () {
                    $('#leftContendBox2').css({
                        width: '0px',
                        // 'box-shadow':'none',
                        // opacity:0
                    });
                    $('body,html').removeClass('stopScrop');
                    $('.mainMack').fadeOut();
                });


                //流程按钮
                $('#configFlowBtn').off().on('click', function () {
                    $('.flowStatus').trigger('click');

                    $('#leftContendBox2').css({
                        width: '80%',
                        height: $(window).height() - 10 + 'px'
                        // 'box-shadow':'1px 10px 1px 1000px rgba(29, 29, 29, 0.5)',
                        // opacity:1
                    });
                    $('.mainMack').fadeIn();

                    $('html,body').animate({scrollTop: 0}, 'slow');
                    $('body,html').addClass('stopScrop');
                });


                //下一步点击 进入清单编辑项
                $('#nextStep').off().on('click', function () {
                    // dom.versionList.css({
                    //     height: 'auto'
                    // });


                    eventHandle.itemListSelectedSet(false, 1);
                });
                //上一步点击
                $('#prevStep').off().on('click', function () {
                    $('.step-one').fadeIn();
                    $('.step-two').fadeOut();
                    $('.step2').removeClass('selected');
                    $('.step1').addClass('selected');

                    //去除添加操作列
                    $('.thAddCol').remove();
                    $('.itemCodeCol').remove();


                });

                //事项新增
                $(document).off('click', '.addBtnLineTrigger');

                $(document).on('click', '.addBtnLineTrigger', function () {
                    eventHandle.addColFun($(this).attr('data-id'), $(this).attr('data-code'), $(this).attr('data-itemId'));
                });

                //编辑事项
                $(document).on('click', '.singleItemEdit', function () {
                    eventHandle.addColFun($(this).attr('data-id'), $(this).attr('data-code'), $(this).attr('data-itemId'), $(this).attr('data-itemName'));

                });

                //事项删除
                $(document).on('click', '.singleItemDelete', function () {
                    var itemid = $(this).attr('data-itemid');
                    layer.confirm("确定删除?", {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        layer.close(index);
                        common.fetchGet("catalog/tiolItem/logicDelTiolItem?id=" + itemid, function (res) {
                            if (res.success) {
                                layer.msg('删除成功', {
                                    time: 3000
                                });
                                $('#refreshBtn').click();
                            } else {
                                layer.msg('删除失败', {
                                    time: 3000
                                });
                            }
                        });
                    });
                });

                //事项还原
                $(document).on('click', '.singleItemBack', function () {
                    var itemid = $(this).attr('data-itemid');
                    layer.confirm("确定还原?", {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        layer.close(index);
                        common.fetchGet("catalog/tiolItem/restoreTiolItem?id=" + itemid, function (res) {
                            if (res.success) {
                                layer.msg('还原成功', {
                                    time: 3000
                                });
                                $('#refreshBtn').click();
                            } else {
                                layer.msg('还原失败', {
                                    time: 3000
                                });
                            }
                        });
                    });
                });

                //事项生效
                $(document).on('click', '.singleItemEnable', function () {
                    var itemid = $(this).attr('data-itemid');
                    layer.confirm("确定生效?", {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        layer.close(index);
                        common.fetchGet("catalog/tiolItem/enStatusByIds?ids=" + itemid, function (res) {
                            if (res.success) {
                                layer.msg('生效成功', {
                                    time: 3000
                                });
                                $('#refreshBtn').click();
                            } else {
                                layer.alert(res.resultMessage, {
                                    time: 3000
                                });
                            }
                        });
                    });
                });

                //事项失效
                $(document).on('click', '.singleItemDisable', function () {
                    var itemid = $(this).attr('data-itemid');
                    layer.confirm("确定失效?", {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        layer.close(index);
                        common.fetchGet("catalog/tiolItem/disStatusByIds?ids=" + itemid, function (res) {
                            if (res.success) {
                                layer.msg('失效成功', {
                                    time: 3000
                                });
                                $('#refreshBtn').click();
                            } else {
                                layer.alert(res.resultMessage, {
                                    time: 3000
                                });
                            }
                        });
                    });
                });

                //事项撤回
                $(document).on('click', '.singleItemReportBack', function () {
                    var itemid = $(this).attr('data-itemid');
                    layer.confirm("确定撤回?", {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        layer.close(index);
                        common.fetchGet("catalog/tiolItem/backTiolItem?id=" + itemid, function (res) {
                            if (res.success) {
                                layer.msg('撤回成功', {
                                    time: 3000
                                });
                                $('#refreshBtn').click();
                            } else {
                                layer.alert(res.resultMessage, {
                                    time: 3000
                                });
                            }
                        });
                    });
                });


                var x = -15;
                var y = 22;
                $(document).on('mouseover', '.itemToolTip', function (e) {
                    var currentDta = itemListMapLine[$(this).attr('data-itemId')];


                    if (currentDta) {
                        var tooltip = "<div id='titleTooltip' style='padding: 10px'>" +
                            "<div style='text-align: left'>事项名称：" + currentDta.itemName + "</div>" +
                            "<div style='text-align: left'>事项编码：" + currentDta.itemCode + "</div>" +
                            "<div style='text-align: left'>事项目录编码：" + (currentDta.itemCode.split('-')[0]) + "</div>" +
                            "<div style='text-align: left'>会议决策顺序：" + (currentDta.itemMeetingOrder ? currentDta.itemMeetingOrder : '-') + "</div>" +
                            "<div style='text-align: left'>经法律审核：" + (currentDta.legalFlag === "1" ? "是" : "否") + "</div>" +
                            "</div>";


                        $("body").append(tooltip); //追加到文档中
                        $("#titleTooltip").css({"top": (e.pageY + y) + "px", "left": (e.pageX + x) + "px"}).show();     //设置X Y坐标， 并且显示
                    }

                }).on('mouseout', '.itemToolTip', function (e) {
                    $("#titleTooltip").remove(); //移除
                }).on('mousemove', '.itemToolTip', function (e) {
                    $("#titleTooltip").css({"top": (e.pageY + y) + "px", "left": (e.pageX + x) + "px"});
                });

                //事项详情
                $(document).on('click', '.detailShow', function () {

                    var currentDom = $(this);

                    var urlParam = '?itemId=' + currentDom.attr('data-itemid');

                    var layerr = top.layer.open({
                        title: currentDom.text(),
                        type: 2,
                        content: baseUrl + 'src/page/ys/itemMgr/itemDetail.html' + urlParam,
                        area: ['90%', '90%'],
                        btn:['关闭'],
                        btnAlign: 'c',
                        yes:function () {
                            top.layer.close(layerr);
                        }
                    });


                    // common.openNewWrap({
                    //     url: '/src/page/ys/itemMgr/itemDetail.html' + urlParam,
                    //     title: currentDom.text()
                    // })

                });


                //事项新增
                $('#addItemList').off().on('click', function () {
                    //清空面板信息
                    $('[name=date1]').val('');
                    $('[name=remark]').val('');
                    $('[name=listName]').val('');
                    $('[name=flowName]').val('');
                    $('[name=flowLabel]').val('');
                    $('[name=flowLabel]').attr('data-flowlabel', '');
                    $('[name=flowLabel]').attr('data-flowname', '');
                    $('#fileUploadListBox ul li[data-fiid]').remove();
                    $('#prevStep').trigger('click');
                    gloVariable.listId = null;

                    dom.addEditItemDetail.show();
                    dom.viewItemDetail.hide();
                    dom.emptyBox.hide();
                    dom.viewPanel.hide();
                    dom.addOrEditPanel.show();

                    // $('[name=listVersion]').val(JSON.stringify(new Date().getFullYear()) + (JSON.stringify(new Date().getMonth() + 1)));
                    $('[name=listVersion]').val($('[name=versionYear]').val() + (JSON.stringify(new Date().getMonth() + 1)));

                    //清单列表加载
                    common.fetchGet('catalog/tiolCatalog/selectTiolCatalog', function (res) {

                        var resData = res.list || [];

                        eventHandle.tableMerge('#mergeTable', resData, 'next');

                    });
                });

                //事项导入事件绑定
                var uploadLoadng;
                upload.render({
                    elem: $('#importItemList'),
                    url: baseUrl + 'zuul/catalog/tiolItemList/importTiolItem',
                    auto: true,
                    data: {},
                    accept: 'file',
                    before: function () {
                        uploadLoadng = common.layerLoader();
                    },
                    done: function (res, index, upload) {
                        if(res.success == true){
                            layer.msg("导入成功", {
                                time: 3000
                            });
                            //刷新列表
                            eventHandle.currentEnterprise({
                                seName: treeCurrentData.name,
                                seId: treeCurrentData.id,
                            }, $('[name=versionYear]').val());

                        }else{
                            layer.alert(res.resultMessage, {
                                time: 20000,
                                btn: ['关闭'],
                                btnAlign: 'c'
                            });
                        }
                        layer.close(uploadLoadng);
                        return false;
                    },
                    error: function () {
                        layer.close(uploadLoadng);
                    }
                });

                //模板下载
                $('#downloadTemplate').off().on('click', function () {

                    var fileIframe = document.createElement("iframe");
                    document.body.appendChild(fileIframe);
                    fileIframe.style.display = "none";

                    // fileIframe.src = baseUrl + "src/page/template/shixianqindan.xls";
                    fileIframe.src = baseUrl + "catalog/tiolItemList/downTemplate";
                });

                //历史数据升迁
                $('#historyStone').off().on('click', function () {
                    var uploadLoadng = common.layerLoader();
                    common.fetchGet('catalog/tiolItemList/historyStone', function (res) {
                        if(res.success == true){
                            layer.msg("历史数据升迁成功", {
                                time: 3000
                            });
                            //刷新列表
                            eventHandle.currentEnterprise({
                                seName: treeCurrentData.name,
                                seId: treeCurrentData.id,
                            }, $('[name=versionYear]').val());

                        }else{
                            layer.alert(res.resultMessage, {
                                time: 3000
                            });
                        }
                        layer.close(uploadLoadng);
                        return false;
                    },function(){
                        layer.close(uploadLoadng);
                    });
                });

                //一键生成事项清单
                $('#oneKeyItemList').off().on('click', function () {
                    var regulationTextLayer = layer.open({
                        type: 1,
                        content: $("#oneKeyVeision").html(),
                        title: "清单版本号",
                        area: ["800px", "300px"],
                        success: function (obj) {
                            var versioninfo =$('[name=versionYear]').val() + (JSON.stringify(new Date().getMonth() + 1));
                            $(obj.selector).find('[name=listVersion]').val(versioninfo);
                            form.on('submit(oneKeyVeision)', function (obj) {
                                var uploadLoadng = common.layerLoader();
                                common.fetchPost('catalog/itemOneKeyCreate/itemOneKeyCreate',
                                    {   seId : treeCurrentData.id,
                                        listVersion : obj.field.listVersion 
                                    }, function (result) {
                                        layer.close(uploadLoadng);
                                        if (result.success) {
                                            layer.msg("一键生成事项清单成功");
                                            layer.close(regulationTextLayer);
                                            //刷新列表
                                            eventHandle.currentEnterprise({
                                            seName: treeCurrentData.name,
                                            seId: treeCurrentData.id,
                                            }, $('[name=versionYear]').val());

                                        } else {
                                            layer.close(uploadLoadng);
                                            layer.close(regulationTextLayer)
                                            layer.msg(result.resultMessage);
                                        }

                                    }, function (err) {
                                        layer.close(uploadLoadng);
                                        layer.close(regulationTextLayer)
                                        layer.alert(err.resultMessage);
                                    });
                                return false;
                            })

                            $(".btnClose").on("click", function () {
                                layer.close(regulationTextLayer)
                            });
                        }
                    })
                });

                //提交按钮
                $('#saveData').off().on('click', function () {
                    if (!isFlowAccess) {
                        eventHandle.itemListSelectedSet('noList', 1);
                    } else {
                        eventHandle.itemListSelectedSet('noList', 0);
                    }
                });

                $(document).off('click', '[data-catalogcode]');
                $(document).on('click', '[data-catalogcode]', function () {
                    if ($(this).is('.tdSelected')) {
                        $(this).removeClass('tdSelected');

                        for (var i = 0; i < itemListSelectedList.length; i++) {
                            if (itemListSelectedList[i]['id'] === $(this).attr('data-id')) {
                                delete itemListSelectedList[i];
                                //清除数组中的空对象
                                itemListSelectedList = common.trimData(itemListSelectedList, 'array');
                            }
                        }

                    } else {
                        $(this).addClass('tdSelected');
                        itemListSelectedList.push(itemListMap[$(this).attr('data-id')]);

                    }
                });

                //刷新表格
                $('#refreshBtn').off().on('click', function () {
                    //清单列表导入
                    common.fetchGet('catalog/tiolItemList/selectTiolCatalog?listid=' + gloVariable.listId + '&type=2', function (dataBack) {

                        var list = dataBack.list || [];
                        var arr = [];
                        if (list.length > 0) {
                            $.map(list, function (item) {
                                if (item.isChecked === '1') {
                                    arr.push(item);
                                }
                            });
                        }
                        eventHandle.tableMerge('#selectedTable', arr, 'edit');

                    });
                });

                common.fetchGet('sysmgr/sysEnterprise/selectAllDescendantNodeFromRootNode?treeType=enterpriseTree', function (res) {
                    var leftTree = tree.render({
                        showLine: true,
                        elem: '#leftTree',
                        "expandOnClickNode": true,
                        data: common.arrayToTreeJson(res.list || [], "id", "pid", "children"),
                        defaultExpandAll: true,
                        request: {
                            name: "title",
                            key: "id",
                            children: "children",
                            checked: "checked",
                            disabled: "disabled",
                            isLeaf: "isLeaf",
                            extendAttr: "extendAttr"
                        },
                        // done: function () {
                        //     //默认第一条点击
                        //     $('#leftTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                        // },
                        lazy: false,
                        response: {// 对于后台数据重新定义名字
                            dataName: "list"
                        },
                        searchNodeMethod: function (value, data) {
                            if (!value) return true;

                            return data.title.indexOf(value) !== -1;
                        }
                    });

                    $("#searchTree").on("change", function () {
                        leftTree.search($.trim($(this).val()));
                    })

                }, false, false);


                tree.on("nodeClick(leftTree)", function (obj) {
                    treeCurrentData = obj.data.currentData;

                });


                $('#leftTree').css('height', $(window).height() - 170 + 'px');

                //下级企业切换
                $('#qiyeTreeSet').off().on('click', function () {

                    $('#leftContendBox1').css({
                        width: '250px',
                        height: $(window).height() - 10 + 'px'
                        // 'box-shadow':'1px 10px 1px 1000px rgba(29, 29, 29, 0.5)',
                        // opacity:1
                    });
                    $('.mainMack').fadeIn();

                    $('html,body').animate({scrollTop: 0}, 'slow');
                    $('body,html').addClass('stopScrop');

                });

                $('#qiyeSet').off().on('click', function () {
                    //刷新页面
                    $('.mainTitle').text(treeCurrentData.name);

                    eventHandle.currentEnterprise({
                        seName: treeCurrentData.name,
                        seId: treeCurrentData.id,
                    }, $('[name=versionYear]').val());

                    $('#leftContendBox1').css({
                        width: '0px',
                        // 'box-shadow':'none',
                        // opacity:0
                    });
                    $('body,html').removeClass('stopScrop');
                    $('.mainMack').fadeOut();
                });
                $('#qiyeClose').off().on('click', function () {
                    $('#leftContendBox1').css({
                        width: '0px',
                        // 'box-shadow':'none',
                        // opacity:0
                    });
                    $('body,html').removeClass('stopScrop');
                    $('.mainMack').fadeOut();
                });


                $('#leftTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                $('#leftTree').find('.eleTree-node-content-icon').eq(0).trigger('click');
                $('#qiyeSet').click();

            },

            //流程日志
            flowDataSet: function () {
                $('#showFlow').empty().hide();
                $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=item" style="width: 100%;height:85%"></iframe>');
                $('#editFlow').show();
            },
            pageLoad: function () {
                if (!isFlowAccess) {
                    $('.systemFlowSetArea').hide();
                    $('.remarkArea').css('width', '100%');
                    $('.listNameArea').css('width', '100%');
                    $('.fileUploadListArea').css('width', '100%');
                }

                element.init();

                common.themeSet();

                common.buttonLimit();

                common.columnSide();

                common.dataAccessReloadModule({});

                eventHandle.flowDataSet($('.flowDataBox'));

                //企业数据导入
                // form.on('select(currentEnterpriseSelect)', function (obj) {
                //     eventHandle.currentEnterprise(common.getUserInfo(), $('[name=versionYear]').val());
                // });
                //版本号切换
                $('[name=versionYear]').val('2019');
                form.render('select');
                form.on('select(versionYear)', function (obj) {
                    eventHandle.currentEnterprise((treeCurrentData && treeCurrentData.id) ? {
                        seName: treeCurrentData.name,
                        seId: treeCurrentData.id,
                    } : common.getUserInfo(), $('[name=versionYear]').val());
                });

                // //默认进入当前用户企业
                // eventHandle.currentEnterprise(common.getUserInfo(), $('[name=versionYear]').val());



                //日期导入
                laydate.render({
                    elem: '[name=date1]',
                    // type: 'date',
                    range: true,
                    value: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' - 2099-12-30'
                });

                //佐证
                common.fileUploadList({
                    elem: '#fileUploadList',
                    appendArea: $('#fileUploadListBox ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    // bindAction:$('#saveData'),
                    data: {
                        resId: function () {
                            if (gloVariable.listId) {
                                return gloVariable.listId
                            } else {
                                isNew = true;
                                gloVariable.listId = common.uuid();
                                return gloVariable.listId;
                            }
                            //return $('[name=gloItemId]').val()
                        },
                        "fiFileType": 'ITEMLIST'
                    }
                });

                dom.versionList.css({
                    "min-height": $(document).height() - 380 + 'px'
                });
            }
        };

        eventHandle.pageLoad();
        eventHandle.domEvent();


    });
