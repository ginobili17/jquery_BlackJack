const deck = [];

 //マークを受け取り数字を付けて配列(deckに追加)
 const cards = mark => {
  for(let i =1; i <14; i++) {
    let card = (mark + i);
    deck.push(card);
  }
}

// マークを作成し関数cardsに渡す
for(let m = 1; m < 5; m++) {
  if (m === 1) {
    // let mark = '♠️';
    cards("♠️");
  } else if (m === 2) {
    // let mark = '♣️';
    cards("♣️");
  } else if (m === 3) {
    // let mark = '❤︎';
    cards("❤︎")
  } else if (m === 4) {
    // let mark = '♦︎';
    cards("♦︎")
  } 
}


// 各手札を配る関数
function deal(hand1, hand2) {
  //配列(deck)からランダムでカード切りとる
  const tramp1 = deck.splice(Math.floor(Math.random() * deck.length),1)[0];
  const tramp2 = deck.splice(Math.floor(Math.random() * deck.length),1)[0];

  // カードを表示
  $(hand1).text(tramp1);
  $(hand2).text(tramp2);

  // 数字のみを切り取り、文字列から数値へ変換
  let hand1Num = Number(tramp1.replace(/[^0-9^\.]/g,""));
  let hand2Num = Number(tramp2.replace(/[^0-9^\.]/g,""));

  // hand1の数字をチェック
  if(hand1Num >= 10) {
    hand1Num = 10;
  } else if (hand1Num === 1) {
    hand1Num = 11;
  } 

  // hand2の数字をチェック
  if(hand2Num >= 10) {
    hand2Num = 10;
  } else if (hand2Num === 1 && hand1Num !== 11) {
    hand2Num = 11;
  } 

  // 配列で管理
  return [hand1Num, hand2Num];

}

// 関数呼び出し
deal(p1, p2);
deal(d1,d2)

// 配列を定数に代入
const hands1 = deal($("#p1"), $("#p2"))
const hands2 = deal($("#d1"), $("#d2"))

//配列内の合計(手札合計)
const sumHand = hands => {
  let sum = 0;
  for(let i = 0, len = hands.length; i < len; i++) {
    sum += hands[i];
  }
  return sum;
};

$("#result").text(sumHand(hands1));

// カードを引く処理
function drowCard(who, hands) {

const drow = $("<div>");

// 引くカードをランダムで作成して表示させる
$(drow).addClass("card-front");
$(drow).text(deck.splice(Math.floor(Math.random() * deck.length),1)[0]);
$(who).append(drow);

// 引いたカードを数値化
let drowNum = (Number($(drow).text().replace(/[^0-9^\.]/g,"")));

//10以上か1かを判定
if (drowNum >= 10) {
  drowNum = 10;
  return drowNum;
} else if (drowNum === 1 && sumHand(hands) <= 10) {
  drowNum = 11;
  return drowNum;
}
return drowNum;
};

// ヒットボタンを押した時
$("#hit").click(function() {

hands1.push(drowCard($("#player"), hands1));
$("#result").text(sumHand(hands1));

// 21以上かを判定
isBurst(hands1, $("#result"), "プレイヤー");

});

// 21以上かを判定
function isBurst(hands, res, who) {
  if (sumHand(hands) > 21) {
    if (hands[0] === 11) {
      hands[0] = 1;
      $(res).text(sumHand(hands));
    } else if (hands[1] === 11) {
      hands[1] = 1;
      $(res).text(sumHand(hands));
    } else {
      $(res).text(`${sumHand(hands)}  : burst! ${who}の負けです`);
      $("#d1").removeClass("card-back").addClass("card-front")
      $("#dealer-result").text(sumHand(hands2));
      NoneBtn()
    }
  }
}

function NoneBtn() {
  $("#hit").css("display", "none");
  $("#stand").css("display", "none");
};

//スタンドボタンを押した時
$("#stand").click(function() {
  $("#d1").removeClass("card-back").addClass("card-front")
  $("#dealer-result").text(sumHand(hands2));


  //手札合計が17以上になるまでカードを引く
  while(sumHand(hands2) <= 16) {
    hands2.push(drowCard($("#dealer"), hands2));
    $("#dealer-result").text(sumHand(hands2));
  }

  // 手札が21以上かを判定
  isBurst(hands2, $("#dealer-result"), "ディーラー");

  // 勝敗判定
  if (sumHand(hands2) <= 21) {
    if (sumHand(hands1) > sumHand(hands2)) {
      $("#result").text(`${sumHand(hands1)} : プレイヤーWIN!!`);
      $("#dealer-result").text(`${sumHand(hands2)} : ディーラーLOSE...`);
      NoneBtn()
    } else if (sumHand(hands2) > sumHand(hands1)) {
      $("#result").text(`${sumHand(hands1)} : プレイヤーLOSE...`);
      $("#dealer-result").text(`${sumHand(hands2)} : ディーラーWIN!!`)
      NoneBtn()
    } else {
      $("#result").text(`${sumHand(hands1)} : DRAW..`);
      $("#dealer-result").text(`${sumHand(hands2)} : DRAW..`);
      NoneBtn()
    }
  } else {
    $("#result").text(`${sumHand(hands1)} : プレイヤーWIN!!`);
    NoneBtn()
  };

});