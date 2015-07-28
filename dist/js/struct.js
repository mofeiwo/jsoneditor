/**
 * �ṹ����
 * Created by songzhongli on 2015/7/18.
 */

var structcontent;

if (structcontent == undefined) {
    structcontent = function (settings) {
        this.init(settings);
    };
}

/**
 * ��ʼ������+���ò���
 */
structcontent.prototype.init = function (settings) {

    this.$structContentWrap = $('.structContentWrap');
    this.$structContentWrap.append(template('Struct-Tool-Bar'));
    this.$structContentWrap.append(template('T-Struct-Body'));

    this.$structContainerContent = this.$structContentWrap.children('.struct-container-content');
    this.$container = $(document.body);

    /**
     * �ṹ���� key=>value
     */
    this.structCustom = settings;

    this.structCell();

    this.loadFunc();
};

/**
 * ���й��ܺ�������
 */
structcontent.prototype.loadFunc = function () {
    this.addSiblingCell();

    this.addSiblingCellSimple();

    this.addChildCell();

    this.upCell();

    this.downCell();

    this.deleteCell();

    this.deleteCellContent();

    this.uploadPic();

    this.saveAllCell();
}

/**
 * �¼� ����
 */
structcontent.prototype.eventCollection = function () {
    //ˢ��ʱ�� ���� ����
    this.refreshActionEvent();

    //�洢�¼�
    this.storeJson();

}

/**
 * ��ʼ���ṹ��Ԫ
 */
structcontent.prototype.structCell = function () {
    var self = this,
        cellContent;

    if (structData) {
        cellContent = template('T-Struct-Display', {structData: self.structCustom.structData});
        self.$structContainerContent.append(cellContent);
    } else {
        cellContent = template('T-Advance', {});
        self.$structContainerContent.append(cellContent);
    }


    this.eventCollection();
}

/**
 * ���ͬ�� �߼���Ԫ
 */
structcontent.prototype.addSiblingCell = function () {

    var self = this;
    self.$container.on("click", '.addSiblingCellBtn', function () {
        var cellContentHtml = template('T-Advance', {});
        $(this).parents('.struct-cell').after(cellContentHtml);

        self.eventCollection();
    });


}

/**
 * ���ͬ�� �򵥵�Ԫ
 */
structcontent.prototype.addSiblingCellSimple = function () {
    var self = this;
    self.$container.on("click", '.addSiblingCellSimpleBtn', function () {
        var cellContentHtml = template('T-Simple', {});
        $(this).parents('.struct-cell').after(cellContentHtml);

        self.eventCollection();
    });


}

/**
 * ����Ӽ���Ԫ
 */
structcontent.prototype.addChildCell = function () {
    var self = this;

    self.$container.on("click", '.addChildCellBtn', function () {
        var cellContentChildHtml = template('T-Advance-Content', {});
        $(this).parents('.struct-cell').find('.cell-content').append(cellContentChildHtml);

        self.eventCollection();
    });


}

/**
 * ��Ԫģ�������ƶ�
 */
structcontent.prototype.upCell = function () {
    var self = this;
    self.$container.on("click", '.upCellBtn', function () {
        var currentParent = $(this).parents('.struct-cell');
        var currentIndex = currentParent.index();
        if (currentIndex == 0) {
            alert('���ۣ����Ʋ���!');
            return;
        } else {
            currentParent.prev().before(currentParent);
            self.eventCollection();
        }
    });


}

/**
 * ��Ԫģ�������ƶ�
 */
structcontent.prototype.downCell = function () {
    var self = this;

    self.$container.on("click", '.downCellBtn', function () {
        var currentParent = $(this).parents('.struct-cell');
        var cellLength = $('.struct-container-content > .struct-cell').length;
        if (currentParent.index() == (cellLength - 1)) {
            alert('���ۣ����Ʋ���!');
            return;
        } else {
            currentParent.next().after(currentParent);

            self.eventCollection();
        }

    });
}
/**
 * ɾ���ṹ��Ԫ
 */
structcontent.prototype.deleteCell = function () {
    var self = this;
    self.$container.on("click", '.delCellBtn', function () {
        if (confirm('ȷ��ɾ����')) {
            $(this).parents('.struct-cell').remove();

            self.eventCollection();
        }
        return false;
    });
}


/**
 * ɾ�� �߼� �ṹ��Ԫ�� �����ֺ�ͼƬ ����ɾ����
 */
structcontent.prototype.deleteCellContent = function () {
    var self = this;
    self.$container.on("click", '.delCellContentBtn', function () {
        var cellContentChildCount = $(this).parents('.cell-content').find('.cell-content-child').length;
        if (cellContentChildCount > 1) {
            if (confirm('ȷ��ɾ����')) {
                $(this).parents('.cell-content-child').remove();

                self.eventCollection();
            }
            return false;
        } else {
            alert('�Ź��Ұɣ�');
            return false;
        }


    });
}

/**
 * ���水ť
 */
structcontent.prototype.saveAllCell = function () {
    var self = this;
    self.$container.on("click", '.btn_save_all', function () {
        self.storeJson();
        alert('����ɹ�');
    });
}

/**
 * ˢ�²����¼�
 */

structcontent.prototype.refreshActionEvent = function () {
    // ���нṹ��Ԫ ����
    var structCellObj = $('.struct-container-content > .struct-cell');
    var cellLength = structCellObj.length;
    if (cellLength <= 1) {
        //ֻ��һ����Ԫʱ����� ɾ�������ƺ�����
        structCellObj.eq(0).find('.delCellBtn').hide();
        structCellObj.eq(0).find('.upCellBtn').hide();
        structCellObj.eq(0).find('.downCellBtn').hide();
    } else {
        //���еĲ�������ʾ
        $('.struct-cell .delCellBtn').show();
        $('.struct-cell .upCellBtn').show();
        $('.struct-cell .downCellBtn').show();
        //��һ��û������
        structCellObj.eq(0).find('.upCellBtn').hide();

        //���һ��û������
        structCellObj.eq(cellLength - 1).find('.downCellBtn').hide();
    }
}

/**
 * ��Ԫģ�� �洢��JSON��
 */
structcontent.prototype.storeJson = function () {
    var self = this;
    var structContent = [];
    $('.struct-container-content > .struct-cell').each(function (index) {
        var structType = $(this).find('.struct-type').val();
        var arrContent = [];//��������
        if (structType == 'advance') {
            $(this).find('.cell-content-child').each(function (childIdx) {
                var arrImg = [];//ͼƬ����
                var currImgLength = $(this).find('img').length;

                if (parseInt(currImgLength)) {
                    $(this).find('img').each(function (idx) {
                        arrImg[idx] = $(this).attr('data-src');
                    })
                }
                arrContent[childIdx] = {
                    'txt': $(this).find('.text_val').val(),
                    'img': arrImg
                };
            });

            structContent[index] = {
                'title': $(this).find('.title_val').val(), //��Ԫ����
                'type': structType, //title-text-img
                'content': arrContent,
            };
        } else if (structType == 'simple') {
            var arrImg = [];//ͼƬ����

            var currImgLength = $(this).find('img').length;

            if (parseInt(currImgLength)) {
                $(this).find('img').each(function (idx) {
                    arrImg[idx] = $(this).attr('data-src');
                })
            }

            arrContent = {
                'txt': $(this).find('.text_val').val(),
                'img': arrImg
            };

            structContent[index] = {
                'type': structType, //title-text-img
                'content': arrContent,
            };
        }


    });

    var structJsonContent = JSON.stringify(structContent);
    $("input[name='" + self.structCustom.structField + "']").val(structJsonContent);

    //�����Ҳ���ʾģ��
    $('#showJsonData').html(JSON.stringify(structContent, null, 2));
}

/**
 *
 */
structcontent.prototype.uploadPic = function () {
    var self = this;
    self.$container.on("change", ".btn_file", function (e) {
        var $cur = $(this);

        var file = $(e.target)[0].files[0];

        if (file) {
            var fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
            if (!fileExtension.match(/.jpg|.gif|.png|.bmp|.jpeg/i)) {
                alert("��ѡ����ļ�����ͼƬ��������ѡ��");
                $(e.target).val("");
                return;
            } else if ((file.fileSize || file.size) > (parseInt(1024) * 10240)) {
                alert("��ѡ���ͼƬ�ļ���С����10M,�뽵��ͼƬ����������!");
                $(e.target).val("");
                return;
            } else if (typeof FileReader !== 'undefined') {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    var imgBase64 = this.result;
                    //$cur.siblings('img').attr("src",imgBase64); //ע�� ��ֹbase64 д��json
                    //�ϴ���������
                    $.ajax({
                        url: "upload.php",
                        data: {
                            //'img': encodeURIComponent(imgBase64.split(',')[1])
                            'img': imgBase64.split(',')[1]
                        },
                        type: "POST",
                        dataType: "json",
                        beforeSend: function (xhr) {
                            console.log("ͼƬ�ϴ���...");
                        },
                        success: function (res) {
                            var pic_url = "http://img2.tuniucdn.com/site/file/deyonUserCenter/images/nomarl.jpg";
                            if (res) {
                                var pic_url = res.url;

                                var picHtml = "<img src='" + pic_url + "' data-src='" + pic_url + "' alt='ͼƬ' width='80' class='img-rounded'>";

                                $cur.parent('.cell-content-img').append(picHtml);
                            } else {
                                alert('�ϴ�ʧ��');
                            }

                        }
                    });
                }
            } else {
                alert("�����������֧��FileReader,��ʹ��chrome,firefox���ִ��������");
                return;
            }
        }
    });
}