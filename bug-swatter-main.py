import wx


class HomeScreen(wx.Frame):

    def __init__(self, parent):
        wx.Frame.__init__(self, parent, title='BugSwatter v. 0.1')

        # font settings
        font = wx.Font(12, family=wx.FONTFAMILY_DECORATIVE, style=0, weight=90, underline=False, faceName="",
                       encoding=wx.FONTENCODING_DEFAULT)

        self.panel = wx.Panel(self)
        self.result = wx.StaticText(self.panel, label="")
        self.result.SetForegroundColour(wx.RED)
        self.button_yes = wx.Button(self.panel, label="Yes, take me to recording")
        self.button_no = wx.Button(self.panel, label="No, show me a tour")
        self.title = wx.StaticText(self.panel, label="Have you used BugSwatter before?", style=wx.ALIGN_CENTER)
        self.title.SetFont(font)

        # Set sizer for the frame, so we can change frame size to match widgets
        self.windowSizer = wx.BoxSizer()
        self.windowSizer.Add(self.panel, 1, wx.ALL | wx.EXPAND)

        # Set sizer for the panel content
        self.sizer = wx.GridBagSizer(6, 6)
        self.sizer.Add(self.title, (0, 0), flag=wx.CENTER)
        self.sizer.Add(self.button_yes, (2, 0), (1, 1))
        self.sizer.Add(self.button_no, (2, 1), (2, 2))
        self.sizer.Add(self.result, (4, 0))

        # Set simple sizer for a nice border
        self.border = wx.BoxSizer()
        self.border.Add(self.sizer, 1, wx.ALL | wx.EXPAND, 5)

        # Use the sizers
        self.panel.SetSizerAndFit(self.border)
        self.SetSizerAndFit(self.windowSizer)

        # Set event handlers
        self.button_yes.Bind(wx.EVT_BUTTON, self.on_button_yes)
        self.button_no.Bind(wx.EVT_BUTTON, self.on_button_no)

    def on_button_yes(self, e):
        self.result.SetLabel("Ok. Taking you to your requested page...")

    def on_button_no(self, e):
        self.result.SetLabel("You need more practice")


app = wx.App(False)

frame = HomeScreen(None)
frame.Show()
app.MainLoop()
