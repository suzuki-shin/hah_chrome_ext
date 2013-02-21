p = prelude

CTRL_KEYCODE = 17
ALT_KEYCODE = 18

KEY =
  'START_HITAHINT':            {CODE: 69,  CTRL: on,  ALT: off} # Ctrl+e
  'FOCUS_FORM':                {CODE: 70,  CTRL: on,  ALT: off} # Ctrl+f
  'TOGGLE_SELECTOR':           {CODE: 186, CTRL: on,  ALT: off} # Ctrl+;
  'CANCEL':                    {CODE: 71,  CTRL: on,  ALT: off} # Ctrl+g
#   'CANCEL':                    {CODE: 27,  CTRL: off, ALT: off} # ESC
  'MOVE_NEXT_SELECTOR_CURSOR': {CODE: 40,  CTRL: off, ALT: off} # down
  'MOVE_PREV_SELECTOR_CURSOR': {CODE: 38,  CTRL: off, ALT: off} # up
  'MOVE_NEXT_FORM':            {CODE: 34,  CTRL: off, ALT: off} # pageup
  'MOVE_PREV_FORM':            {CODE: 33,  CTRL: off, ALT: off} # pagedown
  'BACK_HISTORY':              {CODE: 72,  CTRL: on,  ALT: off} # Ctrl+h

keyMapper = (keyCode, ctrl, alt) ->
  p.first([k for k, v of KEY when v.CODE == keyCode and v.CTRL == ctrl and v.ALT == alt])

class Main

# 何のモードでもない状態を表すモードのクラス
class NeutralMode
  @keydownMap = (e) ->
    console.log('mode: ' + Main.mode)
    console.log('keyCode: ' + e.keyCode)
    console.log('Ctrl: ' + Main.ctrl)
    console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = on
      return

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
    case 'START_HITAHINT'  then @@keyUpHitAHintStart()
    case 'FOCUS_FORM'      then @@keyUpFocusForm()
    case 'TOGGLE_SELECTOR' then @@keyUpSelectorToggle()
#     case KEY_CODE.BACK_HISTORY    then @@keyUpHistoryBack()
    default (-> console.log('default'))
#     e.preventDefault()

  @keyupMap = (e) ->
    console.log('mode: ' + Main.mode)
    console.log('keyCode: ' + e.keyCode)
    console.log('Ctrl: ' + Main.ctrl)
    console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = off
      return

#     switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
#     case 'START_HITAHINT'  then @@keyUpHitAHintStart()
#     case 'FOCUS_FORM'      then @@keyUpFocusForm()
#     case 'TOGGLE_SELECTOR' then @@keyUpSelectorToggle()
# #     case KEY_CODE.BACK_HISTORY    then @@keyUpHistoryBack()
#     default (-> console.log('default'))
#     e.preventDefault()

  @keyUpHitAHintStart =-> false
  @keyUpFocusForm =-> false
  @keyUpSelectorToggle =-> false

  @keyUpHistoryBack =->
    history.back()


Main.start =->
  Main.ctrl = off
  Main.alt = off
  Main.mode = NeutralMode

  $(document).keyup((e) -> Main.mode.keyupMap(e))
  $(document).keydown((e) -> Main.mode.keydownMap(e))

Main.start()
