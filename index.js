let getTime;
let getDay;
let data_;
let table = "";

const App = {
  url: location.host,
  socket: null,
  Connection(day_, time_) {
    let support = "MozWebSocket" in window ? "MozWebSocket" : "WebSocket" in window ? "WebSocket" : null;
    if (!support) {
      alert('Vui lòng cập nhật trình duyệt lên phiên bản mới nhất!');
      location.reload();
    } else {
      try {
        this.socket = new WebSocket(`wss://${this.url}/register`);
        this.socket.onmessage = evt => {
          data_ = evt.data;
          let obj = null;
          try {
            obj = jQuery.parseJSON(evt.data);
          } catch (err) {
            obj.err = 1;
          }
          if (obj.err == 0) {
            switch (obj.msg) {
              case "skin":
                App.socket.send(`classbydate:${day_}:${time_}`);
                break;
              case "addclass":
                location.reload();
                break;
              case "classbydate":
                data_ = JSON.parse(data_);

              /*create table data*/

                //create information for each sucject
                let temp = data_.data.map((item) => {
                  //create school days html
                  let address = item.lr.map((item) => {
                    let item_1 = `<span>Thứ(${item.Day}), Tiết(${item.Time}), Phòng ${item.Room}</span><br/>`;
                    return item_1;
                  });
                  //end create school days html
                  let item_2 = `<tr><th scope="row">${item.mn}</th>
                                        <td>${item.cn}</td>
                                        <td>${address.join('')}</td>
                                        <td>${item.Total}/${item.MaxStudent}</td>
                                        <td>${item.ic}</td>
                                        <td><button name="${item.mn}" value=${item.ic} class="btn btn-primary choose">Đăng ký</button></td>
                                  </tr>`;
                  return item_2;
                });
              //end create information for each sucject
                let tableForm = `<table class="table">
                                                  <thead>
                                                    <tr>
                                                      <th scope="col">Tên môn</th>
                                                      <th scope="col">Tên lớp</th>
                                                      <th scope="col">Thời gian và địa điểm học</th>
                                                      <th scope="col">Số lượng</th>
                                                      <th scope="col">ID</th>
                                                      <th></th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    ${temp.join('')}
                                                  </tbody>
                                                </table>`;
                document.querySelector("body > section > div > span").style.display = "none";
                document.querySelector("body > section > div").innerHTML = tableForm;
              /*end create table data*/

                //add event listener for each submit
                document.querySelectorAll("body > section > div > table > tbody > tr .choose").forEach((item) => {
                    item.addEventListener("click", function () {
                      let id = item.value;
                      if (confirm(`Xác nhận đăng ký ${item.name}?`)) {
                        App.socket.send(`addclass:${id}`);
                      }
                    });
                  });
                //end add
                break;
            }
          } else {
            alert(obj.data);
          }
        };
      } catch (err) {
        alert(`Mất kết nối! Lỗi: ${err}`);
      }
    }
  },
};

//create form input
let createBox = () => {
  let box_content = `<div class="box">
                        <div class="box_get-data">
                          <form>
                            <div class="form-group d-flex align-items-center">
                            <label>Thời gian: </label>
                            <input type="text" class="form-control" id="dayIn" list="days" placeholder="Thứ" required>
                            <datalist id="days">
                                <option value="Thứ 2"></option>
                                <option value="Thứ 3"></option>
                                <option value="Thứ 4"></option>
                                <option value="Thứ 5"></option>
                                <option value="Thứ 6"></option>
                                <option value="Thứ 7"></option>
                                <option value="Chủ nhật"></option>
                            </datalist>
                            <input type="text" class="form-control" id="timeIn" list="time" placeholder="Buổi" required>
                            <datalist id="time">
                                <option value="Sáng"></option>
                                <option value="Chiều">Chiều</option>
                                <option value="Tối">Tối</option>
                            </datalist>
                            </div>
                            <input id="check" class="btn btn-success" type="button" value="Xem">
                            <input id="reset" class="btn btn-secondary" type="reset" value="Reset">
                          </form>
                        </div>
                        <div id="copy_right"><span>© 2020</span><a href="https://www.facebook.com/pdc0102" target="_blank">Phạm Đình Chỉnh</a></div>
                    </div>
                    `;

  let checkTemp = document.querySelector(
    "body > .be-wrapper > .be-left-sidebar"
  );
  if (checkTemp) {
    document.querySelector(".main-content.container-fluid").innerHTML = box_content;
  }
  let boxClassByDate = document.createElement("section");
  document.querySelector("body").appendChild(boxClassByDate);

  document.querySelector('body > section').innerHTML = `<img src="https://lh3.googleusercontent.com/fife/ABSRlIqny5R3PIzS1owIHI9s7Q6hkkLUx3QQCjBSemt8_5nHec_U9xJkFXLK_CmlY5L5B64iXGCfGlmM0GFu3vaBYWJwLDgI3yM6WhR0P5XypIkq4GWQJNe3bDoFa2vfX4o9GFUQh1d2qxBfa8EXH67-cMYqsj0IL6oY3U1zm8l5bywxvOLQcWggLxS2540v7Vzh8R6vE3PerAiiOHwOgpaSQ6Oezm2EzseyFONCIfQFvBhuVADOMIykYFPOxBOTuVTPsf7MuwLOzGXSTj9bk1VrbK_xJ6CrUAmzqD0jlbLDbbw_TCSebxIKszjE5-tZ3G8RsBur6XbfpVue6HX0RU2BGDwJXP_KCUkAf7HzOxS6nlnnqIVbgEgpePugddMZSlkFwa4lzfSHbeycv8drbcO56wbdy4VRVcLLKmlX-_sWaI0X_r6jF5FBXAl7pKfHt4OM3FAsDTUgGgp39wEuuZX12q2CckeGSBV7sqtIJi9EWKAndLjeGIynJpUUO4UOokQKSD67LZYsne-cM8WCzyLaAnHQqBQLYvQBqdEGdxL5Vkjsxcm-q5ZxT8ohY30nYiRDFskfvFWi27M8taevXWt2d5T-3VUfx2fJSQEAnGrAUAcrS47LwcCqxpvfTvwrlnsrARl22w-egknNRI70uDVMbvX9CJkE8V4WWvCGKurv3yy46J3phMjtHPIEXxTh6Is45-sTTYakrWBlME4XyRkg6sHgV89vAfkzDns=w1920-h915-ft" style="display: none;" />`
};
//end create form input
createBox();

//get data
document
  .querySelector(".box .box_get-data #check")
  .addEventListener("click", function () {
    //get time data
    getDay = document.getElementById("dayIn").value;
    getTime = document.getElementById("timeIn").value;
    
    console.log(`Đang lấy dữ liệu ${getTime.toLowerCase()} ${getDay}...`);
    
    if(getDay){getDay = getDay == "Thứ 2" ? 2 : getDay == "Thứ 3" ? 3 : getDay == "Thứ 4" ? 4 : getDay == "Thứ 5" ? 5 : getDay == "Thứ 6" ? 6 : getDay == "Thứ 7" ? 7 : 1};
    if(getTime){getTime = getTime == "Sáng" ? 1 : getTime == "Chiều" ? 2 : 3};

    console.log(`Day: ${getDay}, Time: ${getTime}`);
    //end get time data

    App.Connection(getDay, getTime);//init ajax

    document.querySelector("body section").style.display = "flex";

    let span = document.createElement("span");
    document.querySelector("body > section").appendChild(span);

    let div = document.createElement("div");
    document.querySelector("body > section").appendChild(div);
    let span2 = document.createElement("span");
    document.querySelector("body > section > div").appendChild(span2);
    document.querySelector('body > section > div > span').innerHTML = `<img src="https://lh3.googleusercontent.com/fife/ABSRlIqny5R3PIzS1owIHI9s7Q6hkkLUx3QQCjBSemt8_5nHec_U9xJkFXLK_CmlY5L5B64iXGCfGlmM0GFu3vaBYWJwLDgI3yM6WhR0P5XypIkq4GWQJNe3bDoFa2vfX4o9GFUQh1d2qxBfa8EXH67-cMYqsj0IL6oY3U1zm8l5bywxvOLQcWggLxS2540v7Vzh8R6vE3PerAiiOHwOgpaSQ6Oezm2EzseyFONCIfQFvBhuVADOMIykYFPOxBOTuVTPsf7MuwLOzGXSTj9bk1VrbK_xJ6CrUAmzqD0jlbLDbbw_TCSebxIKszjE5-tZ3G8RsBur6XbfpVue6HX0RU2BGDwJXP_KCUkAf7HzOxS6nlnnqIVbgEgpePugddMZSlkFwa4lzfSHbeycv8drbcO56wbdy4VRVcLLKmlX-_sWaI0X_r6jF5FBXAl7pKfHt4OM3FAsDTUgGgp39wEuuZX12q2CckeGSBV7sqtIJi9EWKAndLjeGIynJpUUO4UOokQKSD67LZYsne-cM8WCzyLaAnHQqBQLYvQBqdEGdxL5Vkjsxcm-q5ZxT8ohY30nYiRDFskfvFWi27M8taevXWt2d5T-3VUfx2fJSQEAnGrAUAcrS47LwcCqxpvfTvwrlnsrARl22w-egknNRI70uDVMbvX9CJkE8V4WWvCGKurv3yy46J3phMjtHPIEXxTh6Is45-sTTYakrWBlME4XyRkg6sHgV89vAfkzDns=w1920-h915-ft" style="width: 25rem" />`
    
    document
      .querySelector("body > section > span")
      .addEventListener("click", function () {
        document.querySelector("body section").style.display = "none";
        document.querySelector("body section").removeChild(span);
        document.querySelector("body section").removeChild(div);
        htmlList = "";
      });
  });
