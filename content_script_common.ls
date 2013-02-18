p = prelude

KEY_CODE =
  START_HITAHINT: 69            # e
  FOCUS_FORM: 70                # f
  TOGGLE_SELECTOR: 186          # ;
  CANCEL: 27                    # ESC
  MOVE_NEXT_SELECTOR_CURSOR: 40 # down
  MOVE_PREV_SELECTOR_CURSOR: 38 # up
  MOVE_NEXT_FORM: 34            # pageup
  MOVE_PREV_FORM: 33            # pagedown
  BACK_HISTORY: 72              # h


class Main

# 何のモードでもない状態を表すモードのクラス
class NeutralMode
  @keyupMap = (e) ->
    switch e.keyCode
    case KEY_CODE.START_HITAHINT  then @@keyUpHitAHintStart()
    case KEY_CODE.FOCUS_FORM      then @@keyUpFocusForm()
    case KEY_CODE.TOGGLE_SELECTOR then @@keyUpSelectorToggle()
#     case KEY_CODE.BACK_HISTORY    then @@keyUpHistoryBack()
    default (-> console.log('default'))
    e.preventDefault()

  @keydownMap = (e) ->
    console.log('keydownMap')

  @keyUpHitAHintStart =-> false
  @keyUpFocusForm =-> false
  @keyUpSelectorToggle =-> false

  @keyUpHistoryBack =->
    history.back()


Main.start =->
  Main.mode = NeutralMode

  $(document).keyup((e) -> Main.mode.keyupMap(e))
  $(document).keydown((e) -> Main.mode.keydownMap(e))

Main.start()
