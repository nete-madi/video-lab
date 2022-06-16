import wx


# TODO: Change frames https://stackoverflow.com/questions/38313244/wxpython-change-frame-onbuttonpress
# https://www.blog.pythonlibrary.org/2018/10/19/wxpython-how-to-open-a-second-window-frame/

class MainFrame(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self, None, title='BugSwatter v. 0.1')
        panel = WelcomePanel(self)
        self.Show()


class SubFrame(wx.Frame):
    def __init__(self, title, parent=None):
        wx.Frame.__init__(self, parent=parent, title=title)
        panel = RecordingPanel(self)
        self.Bind(wx.EVT_CLOSE, self.on_close)
        self.Show()

    def on_close(self, e):
        self.Destroy()


class WelcomePanel(wx.Panel):

    def __init__(self, parent):
        wx.Panel.__init__(self, parent)

        # font settings
        font = wx.Font(12, family=wx.FONTFAMILY_DECORATIVE, style=0, weight=90, underline=False, faceName="",
                       encoding=wx.FONTENCODING_DEFAULT)

        self.panel = wx.Panel(self)
        self.result = wx.StaticText(self.panel, label="")
        self.result.SetForegroundColour(wx.RED)
        self.button_yes = wx.Button(self.panel, label="Yes, take me to recording")
        self.button_no = wx.Button(self.panel, label="No, show me a tour")
        self.title = wx.StaticText(self.panel, label="Have you used BugSwatter before?", style=wx.TEXT_ALIGNMENT_CENTER)
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
        self.frame_number = 1

    def on_button_yes(self, e):
        title = 'SubFrame {}'.format(self.frame_number)
        frame = SubFrame(title="Recording")
        self.frame_number += 1

    def on_button_no(self, e):
        title = 'SubFrame {}'.format(self.frame_number)
        frame = SubFrame(title="BugSwatter Directions")
        self.frame_number += 1


class RecordingPanel(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent)

        # font settings
        font = wx.Font(12, family=wx.FONTFAMILY_DECORATIVE, style=0, weight=90, underline=False, faceName="",
                       encoding=wx.FONTENCODING_DEFAULT)

        self.panel = wx.Panel(self)
        self.button_back = wx.Button(self.panel, label="Take me back")

        # Set sizer for the frame, so we can change frame size to match widgets
        self.windowSizer = wx.BoxSizer()
        self.windowSizer.Add(self.panel, 1, wx.ALL | wx.EXPAND)

        # Set sizer for the panel content
        self.sizer = wx.GridBagSizer(6, 6)
        self.sizer.Add(self.button_back, (0, 0), flag=wx.CENTER)

        # Set simple sizer for a nice border
        self.border = wx.BoxSizer()
        self.border.Add(self.sizer, 1, wx.ALL | wx.EXPAND, 5)

        # Use the sizers
        self.panel.SetSizerAndFit(self.border)
        self.SetSizerAndFit(self.windowSizer)

        # Set event handlers
        self.frame_number = 1


if __name__ == '__main__':
    app = wx.App(False)
    frame = MainFrame()
    frame.Show()
    app.MainLoop()
