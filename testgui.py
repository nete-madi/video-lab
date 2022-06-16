import wx


# TODO: get two buttons next to each other
# TODO: style buttons and make them bigger
# TODO: change background color
# https://pypi.org/project/moviepy/

class MainWindow(wx.Frame):
    def __init__(self):

        # setup
        super().__init__(parent=None, title='Welcome to BugSwatter v. 0.1')
        # panel is required on windows
        panel = wx.Panel(self)
        vbox = wx.BoxSizer(wx.VERTICAL)

        # font settings
        font = wx.SystemSettings.GetFont(wx.SYS_SYSTEM_FONT)
        font.SetWeight(wx.FONTWEIGHT_HEAVY)
        font.SetFractionalPointSize(50)

        # title
        title = wx.StaticText(panel, label="Have you used BugSwatter before?")
        title.SetFont(font)
        vbox.AddSpacer(250)
        vbox.Add(title, wx.CENTER, 5)

        # buttons
        btn_sizer = wx.BoxSizer(wx.HORIZONTAL)
        vbtn_sizer = wx.BoxSizer(wx.VERTICAL)
        btnyes = wx.Button(panel, label='Yes, take me to recording')
        btnno = wx.Button(panel, label='No, show me a tour')
        btnyes.Bind(wx.EVT_BUTTON, self.on_press)
        btnno.Bind(wx.EVT_BUTTON, self.on_press)
        btn_sizer.Add(btnyes, 0, wx.ALL | wx.CENTER, 5)
        btn_sizer.Add(btnno, 0, wx.ALL | wx.CENTER, 5)
        vbtn_sizer.Add(btn_sizer)
        vbtn_sizer.AddSpacer(-250)

        # final setup
        vbox.Add(vbtn_sizer, wx.CENTER, 5)
        panel.SetSizerAndFit(vbox)
        self.Centre()
        self.Maximize(True)
        self.Show()

# functions
    def on_press(self,e):
        print("Ok. Taking you to your requested page...")



# run
if __name__ == '__main__':
    app = wx.App()
    frame = MainWindow()
    app.MainLoop()
