import flask
from flask import Flask,render_template, request, redirect, url_for
import dash
import numpy as np
import tensorflow as tf
import dash_html_components as html
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import pandas as pd
from pathlib import Path
import dash_core_components as dcc
import dash_bootstrap_components as dbc
import copy
from dash.dependencies import ClientsideFunction,Input,Output
import plotly.graph_objects as go
import datetime as dt
import ast
import json
from multiprocessing import Value

counter = Value('i',0)
app = Flask(__name__)
dash_app = dash.Dash(__name__, meta_tags=[{"name": "viewport", "content": "width=device-width"}], server=app, url_base_pathname='/analysis/')
#dash_app.layout = html.Div([html.H1('Hi there, I am app1 for dashboards')])
model = None
#list2append=[]

#defining path
PATH = Path(__file__).parent
DATA_PATH = PATH.joinpath("static").resolve()

# receiving data
df = pd.read_csv(DATA_PATH.joinpath("data_3.csv"), low_memory=False, encoding="utf8")
df_pie = pd.read_csv(DATA_PATH.joinpath("pieplot.csv"), encoding="cp949")
df["report_time"] = pd.to_datetime(df["report_time"])

df_rank = pd.read_csv(DATA_PATH.joinpath("score_data1.csv"), low_memory=False, encoding="utf8")

# data_loc
loc_statuses_dict = dict(서울특별시="서울특별시", 강원도="강원도", 경상남도="경상남도",
                         경상북도="경상북도", 광주광역시="광주광역시",대구광역시 ="대구광역시",
                         대전광역시="대전광역시",부산광역시="부산광역시", 세종특별자치시="세종특별자치시",
                         울산광역시="울산광역시", 인천광역시="인천광역시", 전라남도="전라남도",
                         전라북도="전라북도", 제주특별자치도="제주특별자치도", 충청남도="충청남도", 충청북도="충청북도",
                        )
loc_statuses_options = [
    {'label': str(loc_statuses_dict[loc_status]), "value": str(loc_status)} for loc_status in loc_statuses_dict
]

# defining Layout
mapbox_access_token = "pk.eyJ1IjoiamFja2x1byIsImEiOiJjajNlcnh3MzEwMHZtMzNueGw3NWw5ZXF5In0.fk8k06T96Ml9CLGgKmk81w"

trace1 = go.Pie(
    labels = ['일반산악사고', '일반조난', '실족추락', '기타산악', '개인(급, 만성)질환', '개인질환', '탈진.탈수', '자살기도', '암벽등반', '낙석.낙빙', '저체온증', '야생식물섭취중독', '고온환경질환'],
    values = [27364, 15151, 14745, 6056, 5855, 1648, 922, 623, 298, 84, 80, 22, 15],
    name= '사고원인'
)

data1 = [trace1]

trace2 = go.Bar(
    x= list(df_pie['시간']),
    y= list(df_pie['사고건수']),
    name = '시간별 사고 추이',
)

data2 = [trace2]


layout = dict(
    autosize=True,
    automargin=True,
    margin=dict(l=30, r=30, b=20, t=40),
    hovermode="closest",
    plot_bgcolor="#F9F9F9",
    paper_bgcolor="#F9F9F9",
    legend=dict(font=dict(size=10), orientation="h"),
    title="Satellite Overview",
    mapbox=dict(
        accesstoken=mapbox_access_token,
        style="light",
        center=dict(lon=-78.05, lat=42.54),
        zoom=7,
    ),
)

def filter_dataframe(df, loc_statuses, year_slider):
    dff = df[
        df["산지역"].isin(loc_statuses)
        & (df["report_time"] > dt.datetime(year_slider[0], 1, 1))
        & (df["report_time"] < dt.datetime(year_slider[1], 12, 31))
    ]
    return dff

dash_app.layout = html.Div(
    [
        dcc.Store(id="aggregate_data"),
        # empty Div to trigger javascript file for graph resizing
        html.Div(id="output-clientside"),
        html.Div(
            [
                html.Div(
                    [
                        html.Img(
                            src=dash_app.get_asset_url("dash-logo.png"),
                            id="plotly-image",
                            style={
                                "height": "60px",
                                "width": "auto",
                                "margin-bottom": "25px",
                            },
                        )
                    ],
                    className="one-third column",
                ),
                html.Div(
                    [
                        html.Div(
                            [
                                html.H3(
                                    "System for Analysis of National Trekking Accidents",
                                    style={"margin-bottom": "0px"},
                                ),
                                html.H5(
                                    "Data Analysis Overview", style={"margin-top": "0px"}
                                ),
                            ]
                        )
                    ],
                    className="one-half column",
                    id="title",
                ),
                html.Div(
                    [
                        html.A(
                            html.Button("Back", id="learn-more-button"),
                            href="/",
                        )
                    ],
                    className="one-third column",
                    id="button",
                ),
            ],
            id="header",
            className="row flex-display",
            style={"margin-bottom": "25px"},
        ),
        html.Div(
            [
                html.Div(
                    [
                        html.P(
                            "보고싶은 년도 범위를 선택하세요(히스토그램에 표시할 범위를 선택하세요):",
                            className="control_label",
                        ),
                        dcc.RangeSlider(
                            id="year_slider",
                            min=2010,
                            max=2118,
                            step=1,
                            marks={2010:2010,2022:2011,2034:2012,2046:2013,2058:2014,2070:2015,2082:2016,2094:2017,2106:2018},
                            value=[2010, 2118],
                            className="dcc_control",

                        ),
                        html.P("전국 17개 시도:", className="control_label",style={'padding-top':"60px"}),

                        dcc.Dropdown(
                            id="loc_statuses",
                            options=loc_statuses_options,
                            multi=True,
                            value=list(loc_statuses_dict.keys()),
                            className="dcc_control",
                        ),

                        # dcc.Dropdown(
                        #     id="year_types",
                        #     options=[
                        #         {"label": "2010년 ", "value": 2010},
                        #         {"label": "2011년 ", "value": 2011},
                        #         {"label": "2012년 ", "value": 2012},
                        #         {"label": "2013년 ", "value": 2013},
                        #         {"label": "2014년 ", "value": 2014},
                        #         {"label": "2015년 ", "value": 2015},
                        #         {"label": "2016년 ", "value": 2016},
                        #         {"label": "2017년 ", "value": 2017},
                        #         {"label": "2018년 ", "value": 2018},
                        #     ],
                        #     multi=False,
                        #     value="active",
                        #     className="dcc_control",
                        # ),

                    ],
                    className="pretty_container four columns",
                    id="cross-filter-options",
                ),
                html.Div(
                    [

                        html.Div(
                            [dcc.Graph(id="count_graph")],
                            id="countGraphContainer",
                            className="pretty_container",
                        ),
                    ],
                    id="right-column",
                    className="eight columns",
                ),
            ],
            className="row flex-display",
            style={"height":"auto"},
        ),
        html.Div(
            [
                html.Div(
                    [dcc.Graph(
                        id="graph",
                        figure = go.Figure(data=data1)
                                )
                    ],
                    className="pretty_container five columns",
                ),
                html.Div(
                    [
                        html.Div(
                            [html.H6("Mountain Accident"),
                             html.H6("Mostly Occurred At"),
                             html.H3("02:00 PM "),
                             html.H6("Top 3 Accident Frequent :"),
                             html.H6("Mountains Are :"),
                             html.H3("도봉산, 오봉산, 설악산")
                             ],

                            id="wells",
                            className="mini_container",
                        ),

                        # html.Img(
                        #     src=app.get_asset_url("mountain_accident_wordcloud.jpg"),
                        #     id="word_cloud-image",
                        #     style={
                        #         "height": "auto",
                        #         "width": "300px",
                        #         "margin-bottom": "10px",
                        #     },
                        #     className="mini_container",
                        # ),

                    ],
                    className="pretty_container three columns"
                ),
                html.Div(
                    [dcc.Graph(
                        id="main_graph",
                        figure=go.Figure(data=data2)
                    )],
                    className="pretty_container seven columns",
                ),

            ],
            className="row flex-display",
        ),
        html.Div(
            [
                html.Div(
                    [
                        dbc.ListGroup([
                            dbc.ListGroupItem(
                                [
                                    dbc.ListGroupItemHeading("최근 산악 사고 관련 기사")
                                ]
                            ),
                            dbc.ListGroupItem(
                                "강릉서 폭포에 빠진 60대 산악회원 숨져",
                                href="https://www.yna.co.kr/view/AKR20190820126100062?input=1195m",
                                className="row pretty_container columns"
                            ),
                            dbc.ListGroupItem(
                                "“은누리야”…폭염속 애타는 외침",
                                href="http://www.ccdn.co.kr/news/articleView.html?idxno=587862#09SX",
                                className="row pretty_container columns"
                            ),
                            dbc.ListGroupItem(
                                "[기고]여름철 산행 안전사고 주의해야",
                                href="http://www.asiatoday.co.kr/view.php?key=20190820010010413",
                                className="row pretty_container columns"
                            ),
                            dbc.ListGroupItem(
                                "60대 산악회 회원, 구룡폭포 계곡서 추락사",
                                href="http://cnews.getnews.co.kr/view.php?ud=20190818212014101988c3409001_16",
                                className="row pretty_container columns"
                            ),
                            dbc.ListGroupItem(
                                "여름철 지리산 산악사고 이렇게 예방하자",
                                href="http://www.gnmaeil.com/news/articleView.html?idxno=423562",
                                className="row pretty_container columns"
                            ),
                        ])
                    ], className="pretty_container five columns",
                ),
                html.Div(
                    [
                        html.Div(
                            html.H3('산악 사고 발생 빈도 TOP 300')
                        ),
                        html.Div(
                            html.Iframe(
                                src=dash_app.get_asset_url("acct.html"),
                                style={
                                    "width": "100%",
                                    "height": "400px",
                                },
                            ),
                        ),
                    ],

                    className="pretty_container seven columns"
                ),

            ],
            className="row flex-display",
        ),
    ],
    id="mainContainer",
    style={"display": "flex", "flex-direction": "column"},
)

dash_app.clientside_callback(
    ClientsideFunction(namespace="clientside", function_name="resize"),
    Output("output-clientside", "children"),
    [Input("count_graph", "figure")],
)


# Slider -> count graph
@dash_app.callback(Output("year_slider", "value"), [Input("count_graph", "selectedData")])
def update_year_slider(count_graph_selected):

    if count_graph_selected is None:
        return [2010, 2118]

    nums = [int(point["pointNumber"]) for point in count_graph_selected["points"]]
    return [min(nums) + 2010, max(nums) + 2011]

@dash_app.callback(
    Output("count_graph", "figure"),
    [
        Input("loc_statuses", "value"),
        Input("year_slider", "value"),
    ],
)
def make_count_figure(loc_statuses, year_slider):

    layout_count = copy.deepcopy(layout)

    dff = filter_dataframe(df, loc_statuses, [2010, 2018])
    g = dff[["산지역", "report_time_simple",'report_time']]
    g = g.set_index('report_time')
    g = g.resample("M").count()

    colors = []
    for i in range(2010, 2118):
        if i >= int(year_slider[0]) and i < int(year_slider[1]):
            colors.append("rgb(123, 199, 255)")
        else:
            colors.append("rgba(123, 199, 255, 0.2)")

    data = [
        dict(
            type="scatter",
            mode="markers",
            x=g.index,
            y=g["산지역"],
            name="All Wells",
            opacity=0,
            hoverinfo="skip",
        ),
        dict(
            type="bar",
            x=g.index,
            y=g["산지역"],
            name="bullshit",
            marker=dict(color=colors),
        ),
    ]

    layout_count["title"] = "시기별 산악사고 발생"
    layout_count["dragmode"] = "select"
    layout_count["showlegend"] = False
    layout_count["autosize"] = True

    figure = dict(data=data, layout=layout_count)
    return figure


def loading_model():
    global model
    global graph
    graph = tf.compat.v1.get_default_graph()
    model = tf.keras.models.load_model('model.h5')

loading_model()

@app.route('/')
def hello_world(task=''):
    return render_template('index.html', task=task)

@app.route('/analysis/')
def render_dash():
    return flask.redirect('/dash1')

@app.route('/menu2/')
def contact_us():
    return render_template('menu2.html')
app_1 = DispatcherMiddleware(app, {
    '/dash1' : dash_app.server
})


@app.route('/predict/<numpy_array>')
def predict(numpy_array):
    loading_model()
    x = numpy_array
    x = ast.literal_eval(x)
#    print(type(x))
    x = np.array(x)
#    print(x)
#    print(type(x))
#    x = np.array([-12.2, 0., 2.2, 29., -26.6, 0.])
    list_value = []
    with graph.as_default():
        #x = np.array([-12.2, 0., 2.2, 29., -26.6, 0.])
#        x = [x]
        preds = model.predict_proba(x)
    print(type(preds))
    for preds_length in range(len(preds)):
        s1 = preds[preds_length][1] / preds[preds_length][0]
        s2 = preds[preds_length][2] / preds[preds_length][0]
        s = s1*0.2 + s2*0.8
        list_value.append(s)
    print(preds[0])
    print(preds[0][1])
    return redirect(url_for("hello_world",predict=list_value))

@app.route('/weather', methods=['GET','POST'])
def get_post_javascript_data():
#    list2append=[]
    with counter.get_lock():
        counter.value += 1
#    names = None
#    if request.method == "POST":
    names = request.form
    print(" names: ",names)
#    names = request.args.getlist("data")
#    names = json.load(names)
    names = dict(names)
#    print(type(names))

#    list1 = np.array(list(names.values()), dtype=float)
    list1 = list(names.values())
    print("list1:",list1)
    max_length = int(list1.pop())
    minus_index = (-1)*max_length
    mountain_list = list1[minus_index:]
    list1 = list1[:minus_index]
    print(mountain_list)
    list2 = []
    list2_temp = []
    confirmed_list = []
    for row_num in range(int(len(list1)/6)):
        list2_temp = list1[0+6*row_num:6+6*row_num]
        list2_temp = np.array(list2_temp, dtype=float)
        list2.append(list2_temp)
        if len(list2) == max_length:
            confirmed_list = np.array(list2)
    print("checking list2_temp: ", list2_temp)
    a = confirmed_list.tolist()
    print("checking list 2:", list2)
#    print("checking list confirmed list : ", confirmed_list)
#    list2append.append(list1)

#    print(counter.value)
#    if counter.value >= 15:
#        n = 15 * int(counter.value / 15)
#        new_list = list2append[n:]
#    else:
#        new_list = list2append
#    print(new_list)
    loading_model()
    with graph.as_default():
        #x = np.array([-12.2, 0., 2.2, 29., -26.6, 0.])
#        x = [x]
        preds = model.predict_proba(confirmed_list)
    print(preds)

    list_value = []
    for preds_length in range(len(preds)):
        s1 = preds[preds_length][1] / preds[preds_length][0]
        s2 = preds[preds_length][2] / preds[preds_length][0]
        s = s1 * 0.2 + s2 * 0.8
        list_value.append(s)
    print(list_value)
    list_weight = []
    df_mountains = pd.read_csv(DATA_PATH.joinpath("mountain_weight.csv"))
    for items in mountain_list:
        if len(df_mountains.loc[df_mountains['인접산']==items,"weight"].values) == 0:
            list_weight.append(0.018298748185446165)
        else:
            list_weight.append(df_mountains.loc[df_mountains['인접산']==items,"weight"].values[0])
    print(list_weight)
    array1 = np.array(list_value)
    array2 = np.array(list_weight)
    result_array = array1*array2
    minval = 0.00035494672381888403
    maxval = 41.753419663213286
    result_array = (result_array - minval)/(maxval - minval)
    print(result_array)
    result1 = result_array.tolist()
    if confirmed_list != []:

        print("confirmed")
        #return redirect(url_for('predict', numpy_array=a))
    print("result1", result1)
    # result1 = str(result1)
    # print(type(result1))

    temp_rk = df_rank["mns"].append(pd.Series(result1), ignore_index=True).rank(pct=True, ascending=False)[-15:]
    temp_rk = round(temp_rk*100,2).to_list()
    print(temp_rk)
    temp_rk = str(temp_rk)
    return temp_rk

if __name__ == '__main__':
    loading_model()
    app_1.run()