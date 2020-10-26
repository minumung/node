$(function () {
    'use strict';

    // 해상도 분기점 전역변수
    var $resolution_pc = 1200;
    var $resolution_tablet = 992;
    var $resolution_mobile = 768;

    // 초기화
    aos_init();
    main_hero_init();
    navigation_init();
    mobile_btn_init();
    parallax_init();
    navi_init();

    // 스크롤 이벤트
    $(window).on('scroll', function () {
        header_scroll();
        subhero_scroll();
    }).scroll();

    // 페이지 로딩
    function page_init() {
        $('body').addClass('__load');
    }

    // AOS 실행
    function aos_init() {
        AOS.init({
            once: true
        });
    }

    // 메인 롤링이미지
    function main_hero_init() {
        if ($('#main-hero').length) {
            var $interval = ( $('#main-hero').data('interval') ) ? $('#main-hero').data('interval') : 4000;

            $('#main-hero').slick({
                autoplay: true,
                autoplaySpeed: $interval,
                speed: 600,
                arrows: true,
                dots: true,
                lazyLoad: 'ondemand',
                prevArrow: '<button type="button" class="slick-prev"><i class="ion-ios-arrow-round-back"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="ion-ios-arrow-round-forward"></i></button>'
            });
        }
    }

    // 상단 내비게이션 초기화
    function navigation_init() {
        var $header = $('#header');
        var $openBtn = $header.find('.btn-open-nav');
        var $closeBtn = $header.find('.btn-close-nav');
        var $navDimmed = $header.find('.nav-dimmed');
        var $maxHeight = 0;
        var $bg = $header.find('.subnav-bg');

        $header.find('.gnb > li').each(function () {
            if ($(this).find('.subnav').length) $(this).addClass('has-child-menu');
        });

        function nav_open() {
            $openBtn.attr('aria-expanded', 'true');
            $navDimmed.stop().fadeIn(350);
        }

        function nav_close() {
            $openBtn.attr('aria-expanded', 'false');
            $navDimmed.stop().fadeOut(350);
        }

        $openBtn.on('click', function () {
            nav_open();
        });

        $closeBtn.on('click', function () {
            nav_close();
        });

        $navDimmed.on('click', function () {
            nav_close();
        });

        $header.find('.gnb > li > a').on('mouseenter', function () {
            if ($(window).width() >= $resolution_tablet) {
                $maxHeight = 0;
                $header.addClass('is-active');
                $header.find('.gnb > li').each(function () {
                    if ($(this).find('.subnav').outerHeight() >= $maxHeight) $maxHeight = $(this).find('.subnav').outerHeight();
                });

                $header.find('.subnav').stop().slideDown(300);
                $bg.height($maxHeight).stop().slideDown(300);
            }
        });

        $header.on('mouseleave', function () {
            $header.removeClass('is-active');
            $header.find('.subnav').stop().slideUp(300);
            $bg.stop().slideUp(300);
        });

        $header.find('.gnb > li > a').on('click', function (e) {
            if ($(window).width() < $resolution_tablet) {
                if ($(this).siblings('.subnav').length) {
                    e.preventDefault();

                    if (!$(this).parent().hasClass('is-open')) {
                        $header.find('.gnb > li.is-open').removeClass('is-open');
                        $header.find('.subnav').stop().slideUp(300);
                        $(this).parent().addClass('is-open');
                        $(this).siblings('.subnav').stop().slideDown(300);
                    } else {
                        $(this).parent().removeClass('is-open');
                        $(this).siblings('.subnav').stop().slideUp(300);
                    }
                }
            }
        });
    }

    // 모바일 버튼 클릭이벤트
    function mobile_btn_init() {
        $('.btn').on({
            'touchstart': function () {
                $(this).addClass('active');
            },
            'touchend': function () {
                $(this).removeClass('active');
            }
        });
    }

    // sticky 헤더

    function header_scroll() {
        var $header = $('#header');
        var $scrTop = $(window).scrollTop();
        var $pos = ($('#main-hero').length) ? $('#main-hero').outerHeight() - $header.outerHeight() : $('#sub-hero').outerHeight() - $header.outerHeight();

        if ($scrTop >= $pos) {
            if (!$header.hasClass('sticky')) $header.addClass('sticky');
        } else {
            $header.removeClass('sticky');
        }
    }

    // 서브페이지 드롭다운 내비게이션 연동
    function navi_init() {
        var $gnb = $('#header .gnb');
        var $dropdown = [];
        var $url = $(location).attr('href');
        var $idx_main = 0;
        var $idx_sub = 0;
        var $dropdown_html = [];

        $('.dropdown-nav-section .dropdown-wrap').each(function (i) {
            $dropdown[i] = $(this);
            i++;
        });

        $gnb.children().each(function () {
            if ($url.indexOf($(this).find('>a').attr('href')) > -1) {
                $idx_main = $(this).index();
                $(this).addClass('is-active is-open');
                $(this).find('.subnav').addClass('visible');
            }

            $(this).find('.subnav > li').each(function () {
                if ($url.indexOf($(this).find('>a').attr('href')) > -1) {
                    $idx_main = $(this).closest('.has-child-menu').index();
                    $idx_sub = $(this).index();
                    $(this).addClass('is-active');
                    $(this).closest('.has-child-menu').addClass('is-active');
                }
            });
        });

        if ($('.dropdown-nav-section .dropdown-wrap').length) {
            $dropdown_html[0] = '';
            $dropdown_html[1] = '';

            $gnb.children().each(function () {
                var $link = $(this).find('>a').attr('href');
                var $name = $(this).find('>a').text();

                $dropdown_html[0] += '<li><a href="' + $link + '">' + $name + '</a></li>';
            });

            $gnb.children().eq($idx_main).find('.subnav > li').each(function () {
                var $link = $(this).find('>a').attr('href');
                var $name = $(this).find('>a').text();

                $dropdown_html[1] += '<li><a href="' + $link + '">' + $name + '</a></li>';
            });

            $dropdown[0].find('.dropdown').append($dropdown_html[0]);
            $dropdown[1].find('.dropdown').append($dropdown_html[1]);

            $dropdown[0].find('.dropdown').children().eq($idx_main).addClass('is-active');
            $dropdown[1].find('.dropdown').children().eq($idx_sub).addClass('is-active');

            $dropdown[0].find('>a').text($dropdown[0].find('.is-active').text());
            $dropdown[1].find('>a').text($dropdown[1].find('.is-active').text());

            function dropdown_close() {
                $('.dropdown-nav-section .dropdown-wrap > a').attr('aria-expanded', 'false');
                $('.dropdown-nav-section .dropdown-wrap > .dropdown').stop().slideUp(300);
            }

            $('.dropdown-nav-section .dropdown-wrap > a').on('click', function (e) {
                e.preventDefault();
                if ($(this).attr('aria-expanded') != 'true') {
                    dropdown_close();
                    $(this).attr('aria-expanded', 'true');
                    $(this).siblings('.dropdown').stop().slideDown(300);
                } else {
                    $(this).attr('aria-expanded', 'false');
                    $(this).siblings('.dropdown').stop().slideUp(300);
                }
            });

            $(document).on('click touchend', function (e) {
                if (!$(e.target).is('.dropdown-nav-section .dropdown-wrap > a')) {
                    dropdown_close();
                }
            });
        }
    }

    // 서브비주얼 스크롤시 효과
    function subhero_scroll() {
        if ($('#sub-hero').length) {
            var $target = $('#sub-hero .caption-cell');
            var $scrTop = $(window).scrollTop();
            var $factor = 5;

            if ($scrTop <= $('#sub-hero').outerHeight()) {
                $target.css({
                    'opacity': 1 - (0.025 * ($scrTop / $factor))
                });
            }
        }
    }

    // 패럴랙스 초기화
    function parallax_init() {
        $('[data-parallax]').parallax();
    }

    // 로드 이벤트
    $(window).on('load', function () {
        page_init();
        if ($('#sub-hero').length) $('#sub-hero').addClass('is-loaded');
    });

    // 사업분야 고객이용후기 슬라이더
    $(document).ready(function () {
        if ($('.review-slider').length) {
            $('.review-slider').slick({
                dots: true,
                speed: 600,
                adaptiveHeight: true
            });
        }
    });

    // 제품소개 (페이지형) 갤러리
    $(document).ready(function () {
        if ($('.justify-gallery-row').length) {
            var $gallery = $('.justify-gallery-row');

            $gallery.magnificPopup({
                delegate: 'a',
                type: 'image',
                mainClass: 'mfp-fade',
                removalDelay: 300,
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1]
                }
            });

            $gallery.justifiedGallery({
                rowHeight: 400,
                margins: 10
            });
        }
    });

    // FAQ 기능
    $(document).ready(function () {
        if ($('.faq-list').length) {
            var $faq_article = $('.faq-list .titdesign');

            if($faq_article.length) {
                var $answerRows = '';
                var $answer = [];
                var $answerURL = [];

                $faq_article.each(function(i) {
                    var $this = $(this);
                    $answerURL[i] = $this.find('a').attr('href');
                    $.ajax({
                        url: $answerURL[i],
                        async: false,
                        cache: false,
                        dataType: 'html',
                        type: 'GET',
                        contentType: 'application/x-www-form-urlencoded;charset=euc-kr',
                        beforeSend: function(jqXHR) {
                            jqXHR.overrideMimeType('application/x-www-form-urlencoded;charset=euc-kr');
                        },
                        success: function(data) {
                            $answer[i] = $(data).find('#post_area').html();
                            $answerRows += '<tr class="answer-row hide">';
                            $answerRows += '<td colspan="6">';
                            $answerRows += '<span class="faq-type">A</span>';
                            $answerRows += '<div class="answer-container">' + $answer[i] + '</div>';
                            $answerRows += '</td>';
                            $answerRows += '</tr>';
                            $this.after($answerRows);
                            $answerRows = '';
                        },
                        error: function(response) {
                            console.log(response);
                        }
                    })
                    i++;
                });
            }

            $('.faq-list .bbsnewf5 a').on('click', function (e) {
                if ( !$(".board_admin_bgcolor").length ) {
                    e.preventDefault();

                    if (!$(this).closest('tr').hasClass('is-open')) {
                        $('.faq-list .answer-row').addClass('hide');
                        $('.faq-list .is-open').removeClass('is-open');
                        $(this).closest('tr').addClass('is-open');
                        $(this).closest('tr').next('.answer-row').removeClass('hide');
                    } else {
                        $(this).closest('tr').removeClass('is-open');
                        $(this).closest('tr').next('.answer-row').addClass('hide');
                    }
                }
            });
        }
    });

    /*********************************************
     * 게시판 관련 스크립트
    *********************************************/
    // get parameter
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    // 카테고리 버튼화 처리
    $(document).ready(function () {
        if ($('.board-category').length) {
            if ($('.board-category').find('select').length) {
                var $ca_link = [];
                var $ca_name = [];
                var $ca_current = getUrlParameter('com_board_category_code');
                var $html = '<ul>';

                $('.board-category select option').each(function (i) {
                    $ca_name[i] = $(this).text();
                    $ca_link[i] = $(location).attr('pathname') + '?com_board_category_code=' + $(this).val();

                    $html += '<li><a href="' + $ca_link[i] + '">' + $ca_name[i] + '</a></li>';
                });

                $html += '</ul>';
                $('.board-category').html($html);
                $('.board-category ul li').each(function () {
                    if ($(this).find('a').attr('href').indexOf($ca_current) > -1 && $ca_current != '') $(this).addClass('is-active');
                });

                if (!$('.board-category .is-active').length) $('.board-category ul li:first-child').addClass('is-active');
            } else {
                $('.board-category').remove();
            }
        }

        $('.gallery_etc').each(function() {
            $(this).html($.trim($(this).text().replace('[','').replace(']','').split(':')[1]));
        });
    });

    // 이미지버튼 텍스트버튼 처리
    $(document).ready(function () {
        var $btn_keywords = ['삭제', '이동', '복사', '글쓰기', '검색', '이전', '목록보기', '다음', '수정', '작성완료', '취소', '스팸신고', '답글쓰기', '댓글달기'];

        var $btn_type_input = $("input[type=image]"),
            $btn_type_img = $("img");

        $btn_type_input.each(function () {
            var $src = $(this).attr('src');

            if ($src.indexOf('search.gif') > -1) {
                $(this).before('<input type="submit" id="btn-search" class="btn btn-secondary" value="' + $btn_keywords[4] + '">');
                $(document).on('click', '#btn-search', function () {
                    $(this).next('input[type=image]').trigger('click');
                });
                $(this).hide();
            }

            if ($src.indexOf('confirm.gif') > -1) {
                $(this).before('<input type="submit" id="btn-confirm" class="btn btn-primary btn-lg" value="' + $btn_keywords[9] + '">');
                $(this).hide();
            }

            if ($src.indexOf('comment_write.gif') > -1) {
                $(this).before('<input type="submit" id="btn-comment-write" class="btn btn-primary btn-lg" value="' + $btn_keywords[13] + '">');
                $(document).on('click', '#btn-comment-write', function () {
                    $(this).next('input[type=image]').trigger('click');
                });
                $(this).hide();
            }
        });

        $btn_type_img.each(function () {
            var $src = $(this).attr('src');
            var $event = $(this).attr('onclick');

            if ($src.indexOf('btn_sdel.gif') > -1) {
                $(this).before("<button class='btn btn-warning' onclick='" + $event + "'>" + $btn_keywords[0] + "</button>");
                $(this).remove();
            }

            if ($src.indexOf('move.gif') > -1) {
                $(this).before("<button class='btn btn-warning' onclick='" + $event + "'>" + $btn_keywords[1] + "</button>");
                $(this).remove();
            }

            if ($src.indexOf('copy.gif') > -1) {
                $(this).before("<button class='btn btn-warning' onclick='" + $event + "'>" + $btn_keywords[2] + "</button>");
                $(this).remove();
            }

            if ($src.indexOf('prev.gif') > -1) {
                $(this).parent().addClass('btn btn-default').text($btn_keywords[5]);
            }

            if ($src.indexOf('list.gif') > -1) {
                $(this).parent().addClass('btn btn-secondary').text($btn_keywords[6]);
            }

            if ($src.indexOf('next.gif') > -1) {
                $(this).parent().addClass('btn btn-default').text($btn_keywords[7]);
            }

            if ($src.indexOf('spam.gif') > -1) {
                $(this).before('<button class="btn btn-danger" onclick="' + $event + '">' + $btn_keywords[11] + '</button>');
                $(this).remove();
            }

            if ($src.indexOf('modify.gif') > -1) {
                $(this).parent().addClass('btn btn-warning').text($btn_keywords[8]);
            }

            if ($src.indexOf('delete.gif') > -1) {
                $(this).parent().addClass('btn btn-warning').text($btn_keywords[0]);
            }

            if ($src.indexOf('reply.gif') > -1) {
                $(this).parent().addClass('btn btn-secondary').text($btn_keywords[12]);
            }

            if ($src.indexOf('write.gif') > -1) {
                $(this).parent().addClass('btn btn-secondary').text($btn_keywords[3]);
            }

            if ($src.indexOf('btn_confirm.gif') > -1) {
                $(this).parent().addClass('btn btn-primary btn-lg').text($btn_keywords[9]);
            }

            if ($src.indexOf('cancel.gif') > -1) {
                $(this).parent().addClass('btn btn-secondary btn-lg').text($btn_keywords[10]);
            } 
        });
    });

    // 리스트 게시판 헤더 처리
    $(document).ready(function() {
        $('.att_title').each(function() {
            $(this).attr('rel', $.trim($(this).text().replace(/\s/g,'')));
        });
    });

    // 제품소개 B 타입 (오버레이)
    $(document).ready(function() {
        if ( $('.type-b-row').length ) {
            var $subject = [];
            var $category = [];

            $('.type-b-row .bbsnewf5').each(function(i) {
                var $markup = '';
                $subject[i] = $(this).find('.gallery_title').text();
                $category[i] = $(this).find('.gallery_etc').text();

                $markup = '<div class="article-overlay">';
                $markup += '<div class="article-info">';
                $markup += '<div class="info-inner">';
                $markup += '<p class="category">' + $category[i] + '</p>';
                $markup += '<h4>' + $subject[i] + '</h4>';
                $markup += '</div>';
                $markup += '</div>';
                $markup += '</div>';

                $(this).find('> table tr').not(':eq(0)').remove();
                $(this).find('> table tr').eq(0).find('a').append($markup);
            });
        }
    });
});