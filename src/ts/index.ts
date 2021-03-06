import '/src/scss/style.scss';
import '/src/img/apple-touch-icon.png';
import '/src/img/ogp.png';
import '/src/img/profile_icon.jpg';
import '/src/img/top.jpeg';
import '/src/img/links/facebook.png';
import '/src/img/links/github.png';
import '/src/img/links/mail.png';
import '/src/img/links/twitter.png';
import '/src/img/links/zenn.png';
import '/src/img/works/diwamoto.png';
import '/src/img/works/docker.png';
import '/src/img/works/yource.png';
import '/src/img/works/ownly.png';

declare var SLACK_URL: string;

var reach_flg = false;

$(function () {


    $(window).on('scroll', function () {

        //一定以上スクロールされたらナビゲーションを表示する
        if (window.scrollY > 100) {
            $('.btn_top').removeClass('btn_top_fadeout').addClass('btn_top_appear')
            $('.nav').removeClass('nav_fadeout').addClass('nav_appear')
        } else {
            $('.btn_top').removeClass('btn_top_appear').addClass('btn_top_fadeout')
            $('.nav').removeClass('nav_appear').addClass('nav_fadeout')
        }
        //スマホ用
        if (window.scrollY > $(window).height()) {
            $('.nav_hamburger').removeClass('nav_hamburger_fadeout').addClass('nav_hamburger_appear')
        } else {
            $('.nav_hamburger').removeClass('nav_hamburger_appear').addClass('nav_hamburger_fadeout')
            $('.nav_sp').removeClass('nav_sp_appear')
        }


        //skill用 スクロールしてきたらタイルを一つづつ表示する。
        if ($(window).scrollTop() > $('.skill_card1').offset().top - $(window).height()/2) {
            $('.skill_card1').addClass("skill_animation_under").css("opacity","1")
            .delay(200).queue(function(){
                $('.skill_card2').addClass("skill_animation_under").css("opacity","1").dequeue()
                .delay(200).queue(function(){
                    $('.skill_card3').addClass("skill_animation_under").css("opacity","1").dequeue()
                    .delay(200).queue(function(){
                        $('.skill_card4').addClass("skill_animation_under").css("opacity","1").dequeue()
                        .delay(200).queue(function(){
                            $('.skill_card5').addClass("skill_animation_under").css("opacity","1").dequeue()
                            .delay(200).queue(function(){
                                $('.skill_card6').addClass("skill_animation_under").css("opacity","1").dequeue();
                            });
                        })
                    });
                });
            });
        }
        if ($(window).scrollTop() > $('.skill_card4').offset().top - $(window).height()/2) {
            $('.skill_card4').addClass("skill_animation_under").css("opacity","1")
            .delay(200).queue(function(){
                $('.skill_card5').addClass("skill_animation_under").css("opacity","1").dequeue()
                .delay(200).queue(function(){
                    $('.skill_card6').addClass("skill_animation_under").css("opacity","1").dequeue();
                });
            });
        }


        //history用 スクロールに合わせてタイムラインの棒を画面の真ん中と合わせる
        if ($(window).scrollTop() > $('.history_wrapper').offset().top - $(window).height()) {

            //既に伸びきっていればもう伸ばさない。
            if (reach_flg) {

            } else {

                //画面中央までの長さにする
                // = 画面の大きさの半分 - (画面の上からタイムラインの先頭までの距離)
                $('.history_timeline').height($(window).height() / 2 - ($('.history_timeline').offset().top - $(window).scrollTop()));

                //長さは#history分
                //→#historyよりも下にスクロールしたら高さを#history分にして止める
                if ($('.history_timeline').height() >= $('.history_wrapper').height()) {

                    // = #historyの高さからセクションタイトルを引いた分だけの長さにする。
                    $('.history_timeline').height($('.history_wrapper').height());
                    reach_flg = true
                }
            } 
        }

        //historyの各アイテムについて処理する。
        //TODO: 決め打ちになってるのでここは可変にしたい。
        for (var i = 1; i <= 100; i++) {

            //アイテムが存在したら
            if ($(".history_item" + i).length) {

                var target = $(".history_item" + i)

                //historyの各アイテムが画面の中央にきたら
                if ($(window).scrollTop() + $(window).height() / 2 > target.offset().top) {

                    //表示用のクラスが存在しなければ付与、あれば何もしない。
                    if (!target.hasClass("history_animation_left")) {
                        target.children(".history_timeline_marker").addClass("history_animation_top").css("opacity","1")
                        target.children(".history_time").addClass("history_animation_left").css("opacity","1")
                        target.children(".history_content").addClass("history_animation_left").css("opacity","1")
                        target.children(".history_underline").addClass("history_animation_extend").css("opacity","1")
                    }
                }
            }

        }

        if ($(window).scrollTop() + $(window).height() / 2 > $(".history_now").offset().top) {
            $(".history_now").css("transition", "0.5s").css("opacity", "1")
        }

        //historyのタイトルを表示
        if ($(window).scrollTop() + $(window).height() / 2 > $(".history_summary").offset().top) {
            $(".history_summary").css("transition", "1.5s").css("opacity", "1")
        }



    });

    //topへ戻るボタン
    $('.btn_top').on('click', () => {
        $('body, html').animate({ scrollTop: 0 }, 500);
    })

    //スマホ用のナビゲーションを表示する
    $('.nav_btn').on('click', () => {
        $('.nav_sp').toggleClass('nav_sp_appear')
    })

    //formの送信をキャンセルしてslackに通知を飛ばし、成功のポップアップを出す
    $('.contact_form').on('submit', (e) => {
        e.preventDefault()
        const data = {
            name: $('.input_name').val(),
            email: $('.input_email').val(),
            content: $('.input_content').val()
        }
        $.ajax({
            type: 'POST',
            url: SLACK_URL,
            data: 'payload=' + JSON.stringify({
                text: "<@U013BDR327K>\n *お問い合わせを受信しました。* \n```\n氏名：" + data["name"] + "\nメールアドレス：" + data["email"] + "\nお問い合わせ内容：" + data["content"] + "\n```"
            }),
        }).done(() => {
            //通知メッセージを表示し、5秒後に非表示にする
            $('.contact_flash_msg').text("お問い合わせを送信しました。")
            $('.contact_flash_msg').removeClass("fadeout").addClass("fadein")
            setTimeout(function () {
                $('.contact_flash_msg').removeClass("fadein").addClass("fadeout")
            }, 3000)

            //お問い合わせを何度も送信しないように内容を削除する。
            $('.input_name').val("")
            $('.input_email').val("")
            $('.input_content').val("")

            //問い合わせの確認メールを送信する。
            // Email.send({
            //     SecureToken: "966b4b3b-f91e-4161-ba33-617517c60ad1",
            //     To : data["email"],
            //     From : "info@diwamoto.dev",
            //     Subject : "[diwamoto.dev]お問い合わせを送信しました。",
            //     Body : 
            //         "この度は、お問い合わせ頂き誠にありがとうございます。\n" +
            //         "2営業日以内にご連絡差し上げますので今しばらくお待ちくださいませ。\n\n" + 
            //         "お問い合わせ内容\n\n" + 
            //         "---------------------------\n" +
            //         "お名前：" + data["name"] + "\n" + 
            //         "メールアドレス：" + data["email"] + "\n" + 
            //         "お問い合わせ内容：" + data["content"] + "\n" + 
            //         "---------------------------\n\n\n\n" +
            //         "このメールはdiwamto.devより自動送信されています。"
            // });


        });


    })

    //通知はクリックしたら消える
    $('.contact_flash_msg').on('click', function () {
        $('.contact_flash_msg').removeClass("fadein").addClass("fadeout")
    })


    //works カルーセル設定
    $('.works_preview').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.works_slide',
        zIndex: 1,
    });
    $('.works_slide').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        swipeToSlide: true,
        asNavFor: '.works_preview',
        centerMode: true,
        centerPadding: '60px',
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 2000,
        variableWidth: true,
        zIndex: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
})